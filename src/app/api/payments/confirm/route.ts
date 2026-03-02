import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { confirmPayment, calculateFees, cancelPayment } from '@/lib/payments'

export async function POST(request: Request) {
  try {
    const { paymentKey, orderId, amount, ebookId, purchaseType } = await request.json()

    // DB에서 Supabase 클라이언트 생성
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // 현재 사용자 확인 (결제 전에 먼저 확인)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    // 🔒 보안: 전자책 실제 가격 조회 및 검증
    const { data: ebook, error: ebookError } = await supabase
      .from('ebooks')
      .select('id, seller_id, price_rent_7, price_rent_30, price_buy, status')
      .eq('id', ebookId)
      .single()

    if (ebookError || !ebook) {
      return NextResponse.json({ error: '전자책을 찾을 수 없습니다' }, { status: 404 })
    }

    // 전자책 상태 확인
    if (ebook.status !== 'approved') {
      return NextResponse.json({ error: '구매할 수 없는 전자책입니다' }, { status: 400 })
    }

    // 🔒 보안: 클라이언트가 보낸 금액과 실제 가격 비교
    let expectedAmount: number
    switch (purchaseType) {
      case 'rent_7':
        expectedAmount = ebook.price_rent_7
        break
      case 'rent_30':
        expectedAmount = ebook.price_rent_30
        break
      case 'buy':
        expectedAmount = ebook.price_buy
        break
      default:
        return NextResponse.json({ error: '잘못된 구매 유형입니다' }, { status: 400 })
    }

    if (amount !== expectedAmount) {
      console.error('Price manipulation detected:', { 
        userId: user.id, 
        ebookId, 
        clientAmount: amount, 
        actualAmount: expectedAmount 
      })
      return NextResponse.json({ error: '결제 금액이 일치하지 않습니다' }, { status: 400 })
    }

    // 결제 확인 (토스페이먼츠 API 호출)
    const paymentResult = await confirmPayment({ paymentKey, orderId, amount })

    // 대여 만료일 계산
    let expiresAt = null
    if (purchaseType === 'rent_7') {
      expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    } else if (purchaseType === 'rent_30') {
      expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }

    // 구매 기록 저장
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        user_id: user.id,
        ebook_id: ebookId,
        type: purchaseType,
        amount,
        payment_key: paymentKey,
        payment_status: 'completed',
        expires_at: expiresAt,
      })
      .select()
      .single()

    if (purchaseError) {
      console.error('Purchase save error:', purchaseError)
      // 🔒 보안: 결제는 성공했지만 DB 저장 실패 - 결제 취소 처리
      try {
        await cancelPayment({
          paymentKey,
          cancelReason: 'DB 저장 실패로 인한 자동 취소',
        })
        return NextResponse.json({ 
          error: '결제 처리 중 오류가 발생했습니다. 결제가 취소되었습니다.' 
        }, { status: 500 })
      } catch (cancelError) {
        // 취소도 실패한 경우 - 수동 처리 필요
        console.error('Critical: Payment cancel also failed:', cancelError)
        // TODO: 관리자에게 알림 전송 (이메일/슬랙 등)
        return NextResponse.json({ 
          error: '결제 처리 중 심각한 오류가 발생했습니다. 고객센터에 문의해주세요.' 
        }, { status: 500 })
      }
    }

    // 전자책 판매 카운트 증가
    await supabase
      .from('ebooks')
      .update({ sales_count: supabase.rpc('increment') })
      .eq('id', ebookId)

    // 정산 정보 계산 (정산대행 서비스에서 자동 처리되지만 로깅용)
    const fees = calculateFees(amount)
    console.log('Payment completed:', {
      orderId,
      amount,
      fees,
      sellerId: ebook.seller_id,
    })

    return NextResponse.json({
      success: true,
      purchase,
      payment: paymentResult,
    })
  } catch (error: any) {
    console.error('Payment confirm error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { captureOrder } from '@/lib/paypal'
import { calculateFees } from '@/lib/payments'

export async function POST(request: Request) {
  try {
    const { orderId, ebookId, purchaseType, amount } = await request.json()

    // PayPal 결제 승인
    const captureResult = await captureOrder(orderId)

    if (captureResult.status !== 'COMPLETED') {
      return NextResponse.json({ error: '결제가 완료되지 않았습니다' }, { status: 400 })
    }

    // DB에 구매 기록 저장
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    // 전자책 정보 조회
    const { data: ebook, error: ebookError } = await supabase
      .from('ebooks')
      .select('seller_id')
      .eq('id', ebookId)
      .single()

    if (ebookError) {
      return NextResponse.json({ error: '전자책을 찾을 수 없습니다' }, { status: 404 })
    }

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
        payment_key: orderId,
        payment_method: 'paypal',
        payment_status: 'completed',
        expires_at: expiresAt,
      })
      .select()
      .single()

    if (purchaseError) {
      console.error('Purchase save error:', purchaseError)
    }

    // 전자책 판매 카운트 증가
    await supabase.rpc('increment_sales_count', { ebook_id: ebookId })

    // 정산 정보 로깅
    const fees = calculateFees(amount)
    console.log('PayPal Payment completed:', {
      orderId,
      amount,
      fees,
      sellerId: ebook.seller_id,
    })

    return NextResponse.json({
      success: true,
      purchase,
      captureResult,
    })
  } catch (error: any) {
    console.error('PayPal capture error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createOrder } from '@/lib/paypal'

export async function POST(request: Request) {
  try {
    const { amount, ebookId, purchaseType } = await request.json()

    // 사용자 확인
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    // 전자책 정보 조회
    const { data: ebook, error: ebookError } = await supabase
      .from('ebooks')
      .select('title, seller_id')
      .eq('id', ebookId)
      .single()

    if (ebookError) {
      return NextResponse.json({ error: '전자책을 찾을 수 없습니다' }, { status: 404 })
    }

    // 원화를 달러로 변환 (대략적인 환율 적용, 실제로는 환율 API 사용 권장)
    const usdAmount = amount / 1350 // 대략적인 환율

    // PayPal 주문 생성
    const order = await createOrder({
      amount: usdAmount,
      currency: 'USD',
      description: `북셀 - ${ebook.title} (${purchaseType})`,
    })

    return NextResponse.json({
      orderId: order.id,
      approvalUrl: order.links.find((link: any) => link.rel === 'approve')?.href,
    })
  } catch (error: any) {
    console.error('PayPal order error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

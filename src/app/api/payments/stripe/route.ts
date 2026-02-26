import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createPaymentIntent } from '@/lib/stripe'

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

    // Stripe Payment Intent 생성
    const paymentIntent = await createPaymentIntent({
      amount, // 원화 (KRW)
      currency: 'krw',
      metadata: {
        ebookId,
        ebookTitle: ebook.title,
        purchaseType,
        userId: user.id,
        sellerId: ebook.seller_id,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error: any) {
    console.error('Stripe payment error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

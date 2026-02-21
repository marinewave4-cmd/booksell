import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // 현재 사용자 확인
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    // 구매 정보 조회
    const { data: purchase, error } = await supabase
      .from('purchases')
      .select(`
        id,
        type,
        expires_at,
        payment_status,
        ebook:ebooks(
          id,
          title,
          pdf_url,
          cover_url
        )
      `)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .eq('payment_status', 'completed')
      .single()

    if (error || !purchase) {
      return NextResponse.json({ error: '구매 정보를 찾을 수 없습니다' }, { status: 404 })
    }

    // 대여 만료 확인
    if (purchase.expires_at && new Date(purchase.expires_at) < new Date()) {
      return NextResponse.json({
        error: '대여 기간이 만료되었습니다',
        expired: true
      }, { status: 403 })
    }

    return NextResponse.json(purchase)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

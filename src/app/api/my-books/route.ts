import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // 현재 사용자 확인
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    // 구매 목록 조회
    const { data: purchases, error } = await supabase
      .from('purchases')
      .select(`
        id,
        type,
        expires_at,
        created_at,
        ebook:ebooks(
          id,
          title,
          cover_url,
          seller:profiles(name)
        )
      `)
      .eq('user_id', user.id)
      .eq('payment_status', 'completed')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(purchases)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

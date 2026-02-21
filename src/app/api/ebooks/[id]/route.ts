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

    // 전자책 조회
    const { data: ebook, error } = await supabase
      .from('ebooks')
      .select('*, seller:profiles(id, name, avatar_url)')
      .eq('id', params.id)
      .single()

    if (error || !ebook) {
      return NextResponse.json({ error: '전자책을 찾을 수 없습니다' }, { status: 404 })
    }

    // 승인된 전자책만 공개
    if (ebook.status !== 'approved') {
      // 판매자 본인인 경우만 허용
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.id !== ebook.seller_id) {
        return NextResponse.json({ error: '전자책을 찾을 수 없습니다' }, { status: 404 })
      }
    }

    // 조회수 증가
    await supabase
      .from('ebooks')
      .update({ view_count: (ebook.view_count || 0) + 1 })
      .eq('id', params.id)

    // 리뷰 조회
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*, user:profiles(id, name, avatar_url)')
      .eq('ebook_id', params.id)
      .order('created_at', { ascending: false })
      .limit(20)

    return NextResponse.json({
      ebook,
      reviews: reviews || [],
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

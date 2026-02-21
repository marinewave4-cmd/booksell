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

    // 프로필 조회
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, bank_name, bank_account, account_holder')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'seller') {
      return NextResponse.json({ error: '판매자만 접근할 수 있습니다' }, { status: 403 })
    }

    // 내 전자책 목록
    const { data: books } = await supabase
      .from('ebooks')
      .select('id, title, sales_count, price_buy, status, created_at')
      .eq('seller_id', user.id)
      .neq('status', 'deleted')
      .order('created_at', { ascending: false })

    // 판매 내역 (내 책들의 구매 기록)
    const { data: transactions } = await supabase
      .from('purchases')
      .select(`
        id,
        created_at,
        type,
        amount,
        ebook:ebooks!inner(
          title,
          seller_id
        )
      `)
      .eq('ebook.seller_id', user.id)
      .eq('payment_status', 'completed')
      .order('created_at', { ascending: false })
      .limit(50)

    // 통계 계산
    const totalSales = transactions?.reduce((sum, tx) => sum + tx.amount, 0) || 0

    const thisMonthStart = new Date()
    thisMonthStart.setDate(1)
    thisMonthStart.setHours(0, 0, 0, 0)

    const thisMonthSales = transactions
      ?.filter(tx => new Date(tx.created_at) >= thisMonthStart)
      .reduce((sum, tx) => sum + tx.amount, 0) || 0

    const totalBooks = books?.filter(b => b.status !== 'deleted').length || 0
    const pendingBooks = books?.filter(b => b.status === 'pending').length || 0

    return NextResponse.json({
      stats: {
        totalSales,
        thisMonth: thisMonthSales,
        totalBooks,
        pendingBooks,
      },
      books: books || [],
      transactions: transactions || [],
      bankInfo: {
        bank_name: profile.bank_name || '',
        bank_account: profile.bank_account || '',
        account_holder: profile.account_holder || '',
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

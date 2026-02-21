import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// 입력값 정제 (XSS 방지)
function sanitizeInput(input: string): string {
  if (!input) return ''
  return input
    .replace(/[<>]/g, '') // HTML 태그 제거
    .trim()
    .slice(0, 10000) // 최대 길이 제한
}

// 숫자 검증
function validateNumber(value: any, min: number, max: number, defaultValue: number): number {
  const num = parseInt(value)
  if (isNaN(num) || num < min || num > max) {
    return defaultValue
  }
  return num
}

// 전자책 목록 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = sanitizeInput(searchParams.get('category') || '')
    const search = sanitizeInput(searchParams.get('search') || '')
    const page = validateNumber(searchParams.get('page'), 1, 1000, 1)
    const limit = validateNumber(searchParams.get('limit'), 1, 100, 20)
    const offset = (page - 1) * limit

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    let query = supabase
      .from('ebooks')
      .select('*, seller:profiles(id, name, avatar_url)', { count: 'exact' })
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      // SQL 인젝션 방지: Supabase가 자동으로 처리하지만 추가 검증
      const safeSearch = search.replace(/[%_]/g, '') // LIKE 와일드카드 제거
      query = query.or(`title.ilike.%${safeSearch}%,description.ilike.%${safeSearch}%`)
    }

    const { data, count, error } = await query

    if (error) throw error

    // 캐싱 헤더 추가
    const response = NextResponse.json({
      success: true,
      data,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })

    // 1분간 캐싱, 5분간 stale-while-revalidate
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')

    return response
  } catch (error: any) {
    console.error('GET /api/ebooks error:', error)
    return NextResponse.json(
      { error: '전자책 목록을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

// 전자책 등록
export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // 현재 사용자 확인
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    // 판매자 권한 확인
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'seller') {
      return NextResponse.json({ error: '판매자만 전자책을 등록할 수 있습니다' }, { status: 403 })
    }

    let body: any
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: '잘못된 요청 형식입니다' }, { status: 400 })
    }

    const {
      title,
      description,
      category,
      tags,
      pdf_url,
      cover_url,
      page_count,
      price_rent_7,
      price_rent_30,
      price_buy,
    } = body

    // 필수 필드 검증
    if (!title || !description || !category || !pdf_url) {
      return NextResponse.json({ error: '필수 정보를 입력해주세요' }, { status: 400 })
    }

    // 제목 길이 검증
    if (title.length < 2 || title.length > 100) {
      return NextResponse.json({ error: '제목은 2~100자 사이로 입력해주세요' }, { status: 400 })
    }

    // 설명 길이 검증
    if (description.length < 10 || description.length > 5000) {
      return NextResponse.json({ error: '설명은 10~5000자 사이로 입력해주세요' }, { status: 400 })
    }

    // 가격 검증
    const validatedPrices = {
      price_rent_7: validateNumber(price_rent_7, 0, 1000000, 2900),
      price_rent_30: validateNumber(price_rent_30, 0, 1000000, 4900),
      price_buy: validateNumber(price_buy, 0, 1000000, 7900),
    }

    // 태그 검증 (최대 10개, 각 20자 이내)
    const validatedTags = Array.isArray(tags)
      ? tags.slice(0, 10).map((tag: string) => sanitizeInput(tag).slice(0, 20)).filter(Boolean)
      : []

    // 전자책 등록
    const { data, error } = await supabase
      .from('ebooks')
      .insert({
        seller_id: user.id,
        title: sanitizeInput(title).slice(0, 100),
        description: sanitizeInput(description).slice(0, 5000),
        category: sanitizeInput(category),
        tags: validatedTags,
        pdf_url,
        cover_url,
        page_count: validateNumber(page_count, 0, 10000, 0),
        ...validatedPrices,
        status: 'pending', // 검토 대기
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data,
      message: '전자책이 등록되었습니다. 검토 후 공개됩니다.',
    })
  } catch (error: any) {
    console.error('POST /api/ebooks error:', error)
    return NextResponse.json(
      { error: '전자책 등록 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

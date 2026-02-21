import { NextRequest, NextResponse } from 'next/server'

// GET /api/books - 전자책 목록 조회
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  // TODO: DB 연동
  const books = [
    {
      id: '1',
      title: '퇴직연금 수령 방법과 세금',
      author: '은퇴설계연구소',
      description: '퇴직연금을 현명하게 수령하는 방법',
      category: '경제/금융',
      price_rent_7: 2900,
      price_rent_30: 4900,
      price_buy: 7900,
      pages: 48,
      rating: 4.5,
      reviews_count: 23,
      created_at: '2024-01-15',
    },
  ]

  return NextResponse.json({
    success: true,
    data: books,
    pagination: {
      page,
      limit,
      total: books.length,
    },
  })
}

// POST /api/books - 전자책 등록 (AI 자동등록용)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 필수 필드 검증
    const required = ['title', 'description', 'category', 'price_rent_7', 'price_rent_30', 'price_buy']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // TODO: 실제 DB 저장 및 PDF 업로드 처리
    const newBook = {
      id: `book_${Date.now()}`,
      ...body,
      status: 'pending', // 심사 대기
      created_at: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: newBook,
      message: '전자책이 등록되었습니다. 심사 후 판매가 시작됩니다.',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    )
  }
}

/**
 * API 헬퍼 함수들
 * - 에러 처리 표준화
 * - 응답 타입 정의
 * - 재시도 로직
 */

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  total?: number
  page?: number
  totalPages?: number
}

export interface Ebook {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  cover_url: string | null
  pdf_url: string
  page_count: number
  price_rent_7: number
  price_rent_30: number
  price_buy: number
  rating: number
  reviews_count: number
  view_count: number
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  seller: {
    id: string
    name: string
    avatar_url: string | null
  }
}

export interface Review {
  id: string
  ebook_id: string
  user_id: string
  rating: number
  content: string
  created_at: string
  user: {
    id: string
    name: string
    avatar_url: string | null
  }
}

export interface User {
  id: string
  email: string
  name: string
  role: 'buyer' | 'seller' | 'admin'
  avatar_url?: string
}

// API 에러 클래스
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// 기본 fetch 래퍼
async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retries = 3
): Promise<T> {
  let lastError: Error | null = null

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new ApiError(
          data.error || '요청 처리 중 오류가 발생했습니다',
          response.status
        )
      }

      return data
    } catch (error) {
      lastError = error as Error

      // 네트워크 에러의 경우만 재시도
      if (error instanceof ApiError) {
        throw error
      }

      // 마지막 시도가 아니면 대기 후 재시도
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
  }

  throw lastError || new Error('알 수 없는 오류가 발생했습니다')
}

// 전자책 API
export const ebooksApi = {
  // 목록 조회
  async getList(params: {
    page?: number
    limit?: number
    category?: string
    search?: string
  } = {}): Promise<ApiResponse<Ebook[]>> {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', String(params.page))
    if (params.limit) searchParams.set('limit', String(params.limit))
    if (params.category) searchParams.set('category', params.category)
    if (params.search) searchParams.set('search', params.search)

    return fetchWithRetry(`/api/ebooks?${searchParams}`)
  },

  // 상세 조회
  async getById(id: string): Promise<{ ebook: Ebook; reviews: Review[] }> {
    return fetchWithRetry(`/api/ebooks/${id}`)
  },

  // 등록
  async create(data: Partial<Ebook>): Promise<ApiResponse<Ebook>> {
    return fetchWithRetry('/api/ebooks', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

// 인증 API
export const authApi = {
  // 현재 사용자 정보
  async me(): Promise<User> {
    return fetchWithRetry('/api/auth/me')
  },

  // 로그인
  async login(email: string, password: string): Promise<ApiResponse<User>> {
    return fetchWithRetry('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  // 회원가입
  async signup(email: string, password: string, name: string): Promise<ApiResponse<User>> {
    return fetchWithRetry('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
  },

  // 로그아웃
  async logout(): Promise<void> {
    await fetchWithRetry('/api/auth/logout', { method: 'POST' })
  },
}

// 결제 API
export const paymentsApi = {
  // 결제 확인
  async confirm(data: {
    paymentKey: string
    orderId: string
    amount: number
  }): Promise<ApiResponse<any>> {
    return fetchWithRetry('/api/payments/confirm', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

// 내 책장 API
export const myBooksApi = {
  // 목록 조회
  async getList(): Promise<ApiResponse<any[]>> {
    return fetchWithRetry('/api/my-books')
  },

  // 상세 조회 (PDF URL 포함)
  async getById(id: string): Promise<any> {
    return fetchWithRetry(`/api/my-books/${id}`)
  },
}

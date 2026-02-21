'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

interface Ebook {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  cover_url: string | null
  page_count: number
  price_rent_7: number
  price_rent_30: number
  price_buy: number
  rating: number
  reviews_count: number
  view_count: number
  seller: {
    id: string
    name: string
    avatar_url: string | null
  }
}

interface Review {
  id: string
  rating: number
  content: string
  created_at: string
  user: {
    id: string
    name: string
    avatar_url: string | null
  }
}

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [book, setBook] = useState<Ebook | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOption, setSelectedOption] = useState<'rent_7' | 'rent_30' | 'buy'>('rent_7')

  useEffect(() => {
    fetchBook()
  }, [id])

  const fetchBook = async () => {
    try {
      const res = await fetch(`/api/ebooks/${id}`)
      const data = await res.json()

      if (!res.ok) {
        router.push('/books')
        return
      }

      setBook(data.ebook)
      setReviews(data.reviews || [])
    } catch (error) {
      console.error('Failed to fetch book:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">책을 찾을 수 없습니다</h1>
          <Link href="/books" className="text-blue-600 hover:underline">목록으로 돌아가기</Link>
        </div>
      </div>
    )
  }

  const prices = {
    rent_7: { label: '7일 대여', price: book.price_rent_7 },
    rent_30: { label: '30일 대여', price: book.price_rent_30 },
    buy: { label: '영구 소장', price: book.price_buy },
  }

  const handlePurchase = () => {
    // 로그인 여부 확인 후 결제 페이지로 이동
    router.push(`/checkout/${book.id}?type=${selectedOption}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">북셀</Link>
          <nav className="flex items-center gap-4">
            <Link href="/books" className="text-gray-600 hover:text-gray-900">둘러보기</Link>
            <Link href="/sell" className="text-gray-600 hover:text-gray-900">판매하기</Link>
            <Link href="/my-books" className="text-gray-600 hover:text-gray-900">내 책장</Link>
            <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">로그인</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left - Cover */}
          <div className="lg:col-span-1">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden sticky top-24 shadow-lg">
              {book.cover_url ? (
                <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-6xl font-bold">{book.title[0]}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right - Info */}
          <div className="lg:col-span-2">
            <div className="text-sm text-blue-600 mb-2">{book.category}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <div className="text-gray-600 mb-4">{book.seller?.name || '판매자'}</div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="font-medium">{book.rating?.toFixed(1) || '0.0'}</span>
                <span className="text-gray-400">({book.reviews_count || 0} 리뷰)</span>
              </div>
              <div className="text-gray-400">|</div>
              <div className="text-gray-600">{book.page_count || 0}페이지</div>
              <div className="text-gray-400">|</div>
              <div className="text-gray-600">조회 {book.view_count?.toLocaleString() || 0}</div>
            </div>

            {book.tags && book.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {book.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-gray-600 mb-8 whitespace-pre-line">{book.description}</p>

            {/* Purchase Options */}
            <div className="bg-white rounded-2xl border p-6 mb-8">
              <h3 className="font-semibold mb-4">구매 옵션</h3>
              <div className="space-y-3 mb-6">
                {(Object.keys(prices) as Array<keyof typeof prices>).map(key => (
                  <label
                    key={key}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition ${
                      selectedOption === key ? 'border-blue-600 bg-blue-50' : 'hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="option"
                        checked={selectedOption === key}
                        onChange={() => setSelectedOption(key)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div>
                        <span className="font-medium">{prices[key].label}</span>
                        {key !== 'buy' && (
                          <span className="text-sm text-gray-500 ml-2">
                            (대여 기간 내 무제한 열람)
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-blue-600">
                      {prices[key].price.toLocaleString()}원
                    </span>
                  </label>
                ))}
              </div>
              <button
                onClick={handlePurchase}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
              >
                {prices[selectedOption].label} - {prices[selectedOption].price.toLocaleString()}원
              </button>
              <p className="text-center text-sm text-gray-500 mt-3">
                결제 후 바로 열람 가능합니다
              </p>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl border p-6">
              <h3 className="font-semibold mb-4">리뷰 ({reviews.length})</h3>
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">아직 리뷰가 없습니다.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          {review.user?.avatar_url ? (
                            <img src={review.user.avatar_url} alt="" className="w-full h-full rounded-full" />
                          ) : (
                            <span className="text-gray-600 text-sm">{review.user?.name?.[0] || '?'}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{review.user?.name || '익명'}</div>
                          <div className="flex items-center gap-1 text-sm">
                            <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                            <span className="text-gray-300">{'★'.repeat(5 - review.rating)}</span>
                          </div>
                        </div>
                        <span className="text-sm text-gray-400 ml-auto">
                          {new Date(review.created_at).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                      {review.content && (
                        <p className="text-gray-600 text-sm">{review.content}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

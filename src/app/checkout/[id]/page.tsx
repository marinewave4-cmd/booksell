'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import PaymentButton from '@/components/PaymentButton'

interface Ebook {
  id: string
  title: string
  cover_url: string | null
  price_rent_7: number
  price_rent_30: number
  price_buy: number
  seller: {
    name: string
  }
}

function CheckoutContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const id = params.id as string
  const type = (searchParams.get('type') || 'rent_7') as 'rent_7' | 'rent_30' | 'buy'

  const [book, setBook] = useState<Ebook | null>(null)
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      // 사용자 정보 확인
      const userRes = await fetch('/api/auth/me')
      if (!userRes.ok) {
        router.push(`/login?redirect=/checkout/${id}?type=${type}`)
        return
      }
      const userData = await userRes.json()
      setUser(userData)

      // 책 정보 조회
      const bookRes = await fetch(`/api/ebooks/${id}`)
      const bookData = await bookRes.json()
      if (!bookRes.ok) {
        setError('책 정보를 불러올 수 없습니다')
        return
      }
      setBook(bookData.ebook)
    } catch (err) {
      setError('오류가 발생했습니다')
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

  if (error || !book || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error || '오류가 발생했습니다'}</h1>
          <Link href="/books" className="text-blue-600 hover:underline">목록으로 돌아가기</Link>
        </div>
      </div>
    )
  }

  const getPrice = () => {
    switch (type) {
      case 'rent_7': return book.price_rent_7
      case 'rent_30': return book.price_rent_30
      case 'buy': return book.price_buy
    }
  }

  const getTypeLabel = () => {
    switch (type) {
      case 'rent_7': return '7일 대여'
      case 'rent_30': return '30일 대여'
      case 'buy': return '영구 소장'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">북셀</Link>
          <span className="mx-4 text-gray-300">|</span>
          <span className="text-gray-600">결제하기</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* 주문 정보 */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-bold mb-4">주문 정보</h2>

            <div className="flex gap-4 mb-6">
              <div className="w-20 h-28 rounded overflow-hidden flex-shrink-0">
                {book.cover_url ? (
                  <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">{book.title[0]}</span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium">{book.title}</h3>
                <p className="text-sm text-gray-500">{book.seller?.name}</p>
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-600 text-sm rounded">
                    {getTypeLabel()}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">상품 금액</span>
                <span>{getPrice().toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
                <span>총 결제 금액</span>
                <span className="text-blue-600">{getPrice().toLocaleString()}원</span>
              </div>
            </div>
          </div>

          {/* 결제 수단 */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-bold mb-4">결제 수단</h2>

            <div className="mb-6">
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="font-medium">신용/체크카드</span>
                </div>
                <p className="text-sm text-gray-500">토스페이먼츠 결제창에서 카드를 선택하세요</p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                {type === 'buy' ? (
                  '영구 소장 상품입니다. 기간 제한 없이 열람할 수 있습니다.'
                ) : type === 'rent_7' ? (
                  '결제 후 7일간 열람 가능합니다.'
                ) : (
                  '결제 후 30일간 열람 가능합니다.'
                )}
              </p>
            </div>

            <PaymentButton
              ebookId={book.id}
              ebookTitle={book.title}
              purchaseType={type}
              amount={getPrice()}
              userEmail={user.email}
              userName={user.name}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
            >
              {getPrice().toLocaleString()}원 결제하기
            </PaymentButton>

            <p className="text-center text-sm text-gray-500 mt-4">
              결제 진행 시 <Link href="/terms" className="text-blue-600 hover:underline">이용약관</Link> 및{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">개인정보처리방침</Link>에 동의합니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}

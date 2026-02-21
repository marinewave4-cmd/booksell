'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Purchase {
  id: string
  type: 'rent_7' | 'rent_30' | 'buy'
  expires_at: string | null
  created_at: string
  ebook: {
    id: string
    title: string
    cover_url: string
    seller: {
      name: string
    }
  }
}

export default function MyBooksPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch('/api/my-books')
        const data = await res.json()
        if (res.ok) {
          setPurchases(data)
        }
      } catch (error) {
        console.error('Failed to fetch purchases:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPurchases()
  }, [])

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'rent_7': return '7일 대여'
      case 'rent_30': return '30일 대여'
      case 'buy': return '영구 소장'
      default: return type
    }
  }

  const getRemainingDays = (expiresAt: string | null) => {
    if (!expiresAt) return null
    const diff = new Date(expiresAt).getTime() - Date.now()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">북셀</Link>
            <span className="text-gray-400">/</span>
            <h1 className="text-lg font-medium">내 책장</h1>
          </div>
          <Link href="/books" className="text-blue-600 hover:underline text-sm">
            더 둘러보기
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">책장이 비어있습니다</h2>
            <p className="text-gray-600 mb-6">첫 번째 전자책을 구매하거나 대여해보세요!</p>
            <Link
              href="/books"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              책 둘러보기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {purchases.map((purchase) => {
              const expired = isExpired(purchase.expires_at)
              const remainingDays = getRemainingDays(purchase.expires_at)

              return (
                <div key={purchase.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
                  <div className="aspect-[3/4] relative bg-gray-100">
                    {purchase.ebook.cover_url ? (
                      <img
                        src={purchase.ebook.cover_url}
                        alt={purchase.ebook.title}
                        className={`w-full h-full object-cover ${expired ? 'opacity-50 grayscale' : ''}`}
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${expired ? 'bg-gray-200' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
                        <span className="text-white text-xl font-bold">{purchase.ebook.title[0]}</span>
                      </div>
                    )}

                    {/* 상태 배지 */}
                    <div className="absolute top-2 right-2">
                      {expired ? (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                          만료됨
                        </span>
                      ) : purchase.type === 'buy' ? (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                          소장
                        </span>
                      ) : remainingDays !== null && (
                        <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
                          D-{remainingDays}
                        </span>
                      )}
                    </div>

                    {/* 읽기 버튼 오버레이 */}
                    {!expired && (
                      <Link
                        href={`/read/${purchase.id}`}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium">
                          읽기
                        </span>
                      </Link>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 truncate">{purchase.ebook.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{purchase.ebook.seller?.name}</p>
                    <p className="text-xs text-gray-400 mt-2">{getTypeLabel(purchase.type)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

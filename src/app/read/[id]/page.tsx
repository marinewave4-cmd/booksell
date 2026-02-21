'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import PDFViewer from '@/components/PDFViewer'

interface Purchase {
  id: string
  type: 'rent_7' | 'rent_30' | 'buy'
  expires_at: string | null
  ebook: {
    id: string
    title: string
    pdf_url: string
  }
}

export default function ReadPage() {
  const params = useParams()
  const router = useRouter()
  const [purchase, setPurchase] = useState<Purchase | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        const res = await fetch(`/api/my-books/${params.id}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || '구매 정보를 찾을 수 없습니다')
        }

        setPurchase(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPurchase()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !purchase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">접근 권한이 없습니다</h1>
          <p className="text-gray-600 mt-2">{error || '이 책을 읽으려면 구매하거나 대여해야 합니다.'}</p>
          <Link
            href="/books"
            className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            책 둘러보기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* 헤더 */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-white font-medium truncate max-w-md">
              {purchase.ebook.title}
            </h1>
          </div>

          <Link
            href="/my-books"
            className="text-gray-400 hover:text-white text-sm"
          >
            내 책장
          </Link>
        </div>
      </header>

      {/* PDF 뷰어 */}
      <main className="max-w-5xl mx-auto">
        <PDFViewer
          pdfUrl={purchase.ebook.pdf_url}
          purchaseType={purchase.type}
          expiresAt={purchase.expires_at}
        />
      </main>
    </div>
  )
}

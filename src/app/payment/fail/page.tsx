'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function PaymentFailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const code = searchParams.get('code')
  const message = searchParams.get('message')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mt-6">결제 실패</h1>
        <p className="text-gray-600 mt-2">{message || '결제 중 문제가 발생했습니다.'}</p>
        {code && (
          <p className="text-sm text-gray-400 mt-1">오류 코드: {code}</p>
        )}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => router.back()}
            className="block w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            다시 시도하기
          </button>
          <Link
            href="/books"
            className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            책 둘러보기
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    }>
      <PaymentFailContent />
    </Suspense>
  )
}

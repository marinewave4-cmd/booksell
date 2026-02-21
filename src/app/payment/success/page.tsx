'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const confirmPayment = async () => {
      const paymentKey = searchParams.get('paymentKey')
      const orderId = searchParams.get('orderId')
      const amount = searchParams.get('amount')
      const ebookId = searchParams.get('ebookId')
      const type = searchParams.get('type')

      if (!paymentKey || !orderId || !amount) {
        setStatus('error')
        setMessage('결제 정보가 올바르지 않습니다.')
        return
      }

      try {
        const res = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
            ebookId,
            purchaseType: type,
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || '결제 확인에 실패했습니다')
        }

        setStatus('success')
        setMessage('결제가 완료되었습니다!')
      } catch (error: any) {
        setStatus('error')
        setMessage(error.message)
      }
    }

    confirmPayment()
  }, [searchParams])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">결제를 확인하고 있습니다...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {status === 'success' ? (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-6">결제 완료</h1>
            <p className="text-gray-600 mt-2">{message}</p>
            <div className="mt-8 space-y-3">
              <Link
                href="/my-books"
                className="block w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                내 책장으로 이동
              </Link>
              <Link
                href="/books"
                className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                더 둘러보기
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-6">결제 실패</h1>
            <p className="text-gray-600 mt-2">{message}</p>
            <div className="mt-8">
              <button
                onClick={() => router.back()}
                className="block w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                다시 시도하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}

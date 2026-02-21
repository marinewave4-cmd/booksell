'use client'

import { useState, useEffect } from 'react'
import { generateOrderId } from '@/lib/payments'

declare global {
  interface Window {
    TossPayments: any
  }
}

interface PaymentButtonProps {
  ebookId: string
  ebookTitle: string
  purchaseType: 'rent_7' | 'rent_30' | 'buy'
  amount: number
  userEmail: string
  userName: string
  onSuccess?: (paymentKey: string) => void
  onFail?: (error: string) => void
  className?: string
  children?: React.ReactNode
}

export default function PaymentButton({
  ebookId,
  ebookTitle,
  purchaseType,
  amount,
  userEmail,
  userName,
  onSuccess,
  onFail,
  className = '',
  children,
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [tossPayments, setTossPayments] = useState<any>(null)

  useEffect(() => {
    // 토스페이먼츠 SDK 로드
    const script = document.createElement('script')
    script.src = 'https://js.tosspayments.com/v1/payment'
    script.async = true
    script.onload = () => {
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY
      if (clientKey && window.TossPayments) {
        setTossPayments(window.TossPayments(clientKey))
      }
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = async () => {
    if (!tossPayments) {
      alert('결제 시스템을 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }

    setIsLoading(true)

    try {
      const orderId = generateOrderId()
      const typeLabel = purchaseType === 'rent_7' ? '7일 대여' : purchaseType === 'rent_30' ? '30일 대여' : '영구 구매'
      const orderName = `${ebookTitle} - ${typeLabel}`

      await tossPayments.requestPayment('카드', {
        amount,
        orderId,
        orderName,
        customerName: userName,
        customerEmail: userEmail,
        successUrl: `${window.location.origin}/payment/success?ebookId=${ebookId}&type=${purchaseType}`,
        failUrl: `${window.location.origin}/payment/fail`,
      })
    } catch (error: any) {
      if (error.code === 'USER_CANCEL') {
        // 사용자가 결제를 취소함
      } else {
        onFail?.(error.message || '결제 중 오류가 발생했습니다')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading || !tossPayments}
      className={`${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading ? '처리 중...' : children}
    </button>
  )
}

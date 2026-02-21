// 토스페이먼츠 결제 라이브러리
// 토스페이먼츠 정산대행 서비스 사용

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!
const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY!

export interface PaymentRequest {
  orderId: string
  orderName: string
  amount: number
  customerEmail: string
  customerName: string
  successUrl: string
  failUrl: string
}

export interface PaymentConfirmRequest {
  paymentKey: string
  orderId: string
  amount: number
}

// 결제 확인 (서버)
export async function confirmPayment(request: PaymentConfirmRequest) {
  const { paymentKey, orderId, amount } = request

  const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(TOSS_SECRET_KEY + ':').toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      paymentKey,
      orderId,
      amount,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || '결제 확인에 실패했습니다')
  }

  return data
}

// 결제 취소/환불
export async function cancelPayment(paymentKey: string, cancelReason: string, cancelAmount?: number) {
  const response = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(TOSS_SECRET_KEY + ':').toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cancelReason,
      ...(cancelAmount && { cancelAmount }),
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || '결제 취소에 실패했습니다')
  }

  return data
}

// 결제 조회
export async function getPayment(paymentKey: string) {
  const response = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(TOSS_SECRET_KEY + ':').toString('base64')}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || '결제 조회에 실패했습니다')
  }

  return data
}

// 주문번호 생성
export function generateOrderId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `BS-${timestamp}-${random}`.toUpperCase()
}

// 수수료 계산 (정산대행 기준)
export function calculateFees(amount: number) {
  // 플랫폼 수수료 15%
  const platformFee = Math.round(amount * 0.15)
  // PG 수수료 (토스페이먼츠 평균 3.3%)
  const pgFee = Math.round(amount * 0.033)
  // 판매자 정산금액
  const sellerAmount = amount - platformFee - pgFee

  return {
    totalAmount: amount,
    platformFee,
    pgFee,
    sellerAmount,
  }
}

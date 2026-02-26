// PayPal 결제 연동 (해외 결제)

const PAYPAL_API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

// PayPal Access Token 발급
async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID!
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const data = await response.json()
  return data.access_token
}

// 주문 생성
export async function createOrder({
  amount,
  currency = 'USD',
  description,
}: {
  amount: number
  currency?: string
  description?: string
}) {
  const accessToken = await getAccessToken()

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
          description,
        },
      ],
    }),
  })

  const data = await response.json()
  return data
}

// 주문 승인 (결제 완료)
export async function captureOrder(orderId: string) {
  const accessToken = await getAccessToken()

  const response = await fetch(
    `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  )

  const data = await response.json()
  return data
}

// 주문 조회
export async function getOrder(orderId: string) {
  const accessToken = await getAccessToken()

  const response = await fetch(
    `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  )

  const data = await response.json()
  return data
}

// 환불 처리
export async function refundPayment({
  captureId,
  amount,
  currency = 'USD',
}: {
  captureId: string
  amount?: number
  currency?: string
}) {
  const accessToken = await getAccessToken()

  const body: any = {}
  if (amount) {
    body.amount = {
      currency_code: currency,
      value: amount.toFixed(2),
    }
  }

  const response = await fetch(
    `${PAYPAL_API_BASE}/v2/payments/captures/${captureId}/refund`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  )

  const data = await response.json()
  return data
}

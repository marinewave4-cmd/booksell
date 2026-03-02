import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase Admin 클라이언트 (Webhook에서는 서버 사이드로 처리)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 토스페이먼츠 Webhook 시크릿 키 검증
function verifyWebhookSignature(body: string, signature: string): boolean {
  // 토스페이먼츠 Webhook 시그니처 검증
  // 실제 구현 시 HMAC-SHA256 검증 필요
  const secretKey = process.env.TOSS_WEBHOOK_SECRET
  if (!secretKey) {
    console.warn('TOSS_WEBHOOK_SECRET not configured')
    return true // 개발 환경에서는 통과
  }
  
  // TODO: 실제 시그니처 검증 구현
  return true
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-toss-signature') || ''

    // 시그니처 검증
    if (!verifyWebhookSignature(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)
    console.log('Toss Webhook received:', event.eventType)

    switch (event.eventType) {
      case 'PAYMENT_COMPLETED':
        // 결제 완료
        await handlePaymentCompleted(event.data)
        break

      case 'PAYMENT_CANCELED':
        // 결제 취소
        await handlePaymentCanceled(event.data)
        break

      case 'PAYMENT_FAILED':
        // 결제 실패
        await handlePaymentFailed(event.data)
        break

      case 'VIRTUAL_ACCOUNT_DEPOSIT_CALLBACK':
        // 가상계좌 입금 완료
        await handleVirtualAccountDeposit(event.data)
        break

      default:
        console.log('Unhandled event type:', event.eventType)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// 결제 완료 처리
async function handlePaymentCompleted(data: any) {
  const { orderId, paymentKey, totalAmount } = data

  // 주문 상태 업데이트
  const { error } = await supabase
    .from('purchases')
    .update({ 
      payment_status: 'completed',
      payment_key: paymentKey,
      updated_at: new Date().toISOString()
    })
    .eq('order_id', orderId)

  if (error) {
    console.error('Failed to update purchase:', error)
  }

  console.log(`Payment completed: ${orderId}, amount: ${totalAmount}`)
}

// 결제 취소 처리
async function handlePaymentCanceled(data: any) {
  const { orderId, cancelAmount, cancelReason } = data

  // 주문 상태 업데이트
  const { error } = await supabase
    .from('purchases')
    .update({ 
      payment_status: 'canceled',
      cancel_reason: cancelReason,
      updated_at: new Date().toISOString()
    })
    .eq('order_id', orderId)

  if (error) {
    console.error('Failed to update canceled purchase:', error)
  }

  console.log(`Payment canceled: ${orderId}, amount: ${cancelAmount}, reason: ${cancelReason}`)
}

// 결제 실패 처리
async function handlePaymentFailed(data: any) {
  const { orderId, code, message } = data

  // 주문 상태 업데이트
  const { error } = await supabase
    .from('purchases')
    .update({ 
      payment_status: 'failed',
      error_code: code,
      error_message: message,
      updated_at: new Date().toISOString()
    })
    .eq('order_id', orderId)

  if (error) {
    console.error('Failed to update failed purchase:', error)
  }

  console.log(`Payment failed: ${orderId}, code: ${code}, message: ${message}`)
}

// 가상계좌 입금 완료 처리
async function handleVirtualAccountDeposit(data: any) {
  const { orderId, paymentKey, totalAmount } = data

  // 구매 기록 조회
  const { data: purchase, error: fetchError } = await supabase
    .from('purchases')
    .select('*')
    .eq('order_id', orderId)
    .single()

  if (fetchError || !purchase) {
    console.error('Purchase not found:', orderId)
    return
  }

  // 주문 상태 업데이트
  const { error } = await supabase
    .from('purchases')
    .update({ 
      payment_status: 'completed',
      payment_key: paymentKey,
      updated_at: new Date().toISOString()
    })
    .eq('order_id', orderId)

  if (error) {
    console.error('Failed to update deposit:', error)
  }

  console.log(`Virtual account deposit: ${orderId}, amount: ${totalAmount}`)
}

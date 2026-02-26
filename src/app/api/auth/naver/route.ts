import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Supabase에서 네이버 로그인 지원 (커스텀 OIDC provider로 설정 필요)
    // 네이버는 Supabase 기본 제공자가 아니므로 커스텀 구현 필요
    const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID
    const NAVER_REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/naver/callback`
    const state = Math.random().toString(36).substring(7)

    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(NAVER_REDIRECT_URI)}&state=${state}`

    return NextResponse.json({ url: naverAuthUrl })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

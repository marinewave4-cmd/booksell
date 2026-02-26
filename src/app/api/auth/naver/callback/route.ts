import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  try {
    // 네이버 액세스 토큰 요청
    const tokenResponse = await fetch('https://nid.naver.com/oauth2.0/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.NAVER_CLIENT_ID!,
        client_secret: process.env.NAVER_CLIENT_SECRET!,
        code,
        state: state || '',
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      return NextResponse.redirect(`${origin}/login?error=${tokenData.error}`)
    }

    // 네이버 사용자 정보 요청
    const userResponse = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const userData = await userResponse.json()
    const naverUser = userData.response

    // Supabase에 사용자 생성 또는 로그인
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // 이메일로 기존 사용자 확인
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', naverUser.email)
      .single()

    if (!existingUser) {
      // 새 사용자 생성 (Supabase Auth 사용)
      const { data, error } = await supabase.auth.signUp({
        email: naverUser.email,
        password: `naver_${naverUser.id}_${Date.now()}`, // 임시 비밀번호
        options: {
          data: {
            name: naverUser.name || naverUser.nickname,
            avatar_url: naverUser.profile_image,
            provider: 'naver',
            provider_id: naverUser.id,
          },
        },
      })

      if (error) {
        console.error('Naver signup error:', error)
        return NextResponse.redirect(`${origin}/login?error=signup_failed`)
      }
    } else {
      // 기존 사용자 로그인 처리
      // OTP 없는 매직링크 방식 또는 세션 생성
    }

    return NextResponse.redirect(`${origin}/?login=success`)
  } catch (error: any) {
    console.error('Naver callback error:', error)
    return NextResponse.redirect(`${origin}/login?error=callback_failed`)
  }
}

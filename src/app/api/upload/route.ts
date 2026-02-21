import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // 현재 사용자 확인
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    // 판매자 권한 확인
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'seller') {
      return NextResponse.json({ error: '판매자만 파일을 업로드할 수 있습니다' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'pdf' or 'cover'

    if (!file) {
      return NextResponse.json({ error: '파일이 필요합니다' }, { status: 400 })
    }

    // 파일 타입 검증
    if (type === 'pdf' && file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'PDF 파일만 업로드 가능합니다' }, { status: 400 })
    }

    if (type === 'cover' && !file.type.startsWith('image/')) {
      return NextResponse.json({ error: '이미지 파일만 업로드 가능합니다' }, { status: 400 })
    }

    // 파일 크기 제한 (PDF: 100MB, 이미지: 10MB)
    const maxSize = type === 'pdf' ? 100 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({
        error: `파일 크기는 ${type === 'pdf' ? '100MB' : '10MB'} 이하여야 합니다`
      }, { status: 400 })
    }

    // 파일명 생성
    const ext = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`
    const bucket = type === 'pdf' ? 'ebooks' : 'covers'

    // Supabase Storage에 업로드
    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: '파일 업로드에 실패했습니다' }, { status: 500 })
    }

    // 공개 URL 생성
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    // PDF인 경우 페이지 수 추출 (간단한 방법)
    let pageCount = 0
    if (type === 'pdf') {
      // 실제로는 pdf-parse 등의 라이브러리를 사용해야 함
      // 여기서는 간단히 0으로 반환
      pageCount = 0
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: data.path,
      pageCount,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

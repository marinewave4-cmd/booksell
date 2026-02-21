'use client'

/**
 * 스킵 링크 컴포넌트
 * 키보드 사용자가 반복적인 네비게이션을 건너뛸 수 있게 해줍니다.
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
    >
      본문으로 건너뛰기
    </a>
  )
}

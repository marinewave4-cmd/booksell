import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold text-white">
              북셀
            </Link>
            <p className="mt-3 text-gray-400 max-w-md">
              AI 시대의 전자책 마켓플레이스. 전자책을 대여하고 구매하는 가장 쉬운 방법.
              크리에이터를 위한 자동 등록 API를 제공합니다.
            </p>
            <div className="mt-4 flex gap-4">
              <a
                href="mailto:support@booksell.kr"
                className="text-gray-400 hover:text-white transition"
                aria-label="이메일"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* 서비스 */}
          <div>
            <h3 className="text-white font-semibold mb-4">서비스</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/books" className="hover:text-white transition">
                  전자책 둘러보기
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-white transition">
                  판매자 등록
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="hover:text-white transition">
                  API 문서
                </Link>
              </li>
            </ul>
          </div>

          {/* 고객지원 */}
          <div>
            <h3 className="text-white font-semibold mb-4">고객지원</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <a href="mailto:support@booksell.kr" className="hover:text-white transition">
                  문의하기
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} 북셀. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              사업자등록번호: 000-00-00000 | 통신판매업신고: 제0000-서울강남-0000호
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

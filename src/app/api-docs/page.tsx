import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'API 문서',
  description: '북셀 전자책 마켓플레이스 REST API 문서. AI 에이전트, 자동화 도구와 쉽게 연동할 수 있습니다.',
  openGraph: {
    title: 'API 문서 | 북셀',
    description: '북셀 전자책 마켓플레이스 REST API 문서',
  },
  alternates: {
    canonical: '/api-docs',
  },
}

const apiJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  name: '북셀 API 문서',
  description: '전자책 대여/구매 마켓플레이스 북셀의 REST API 문서',
  url: 'https://booksell.kr/api-docs',
  author: {
    '@type': 'Organization',
    name: '북셀',
  },
}

export default function ApiDocsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(apiJsonLd) }}
      />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full" id="main-content">
          <h1 className="text-3xl font-bold mb-4">API 문서</h1>
          <p className="text-gray-600 mb-8">
            북셀 REST API를 사용하여 전자책을 자동으로 등록하고 관리하세요.
            AI 에이전트, 자동화 도구와 쉽게 연동할 수 있습니다.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h2 className="font-semibold text-blue-800 mb-2">빠른 링크</h2>
            <div className="flex flex-wrap gap-4">
              <a href="/openapi.json" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
                OpenAPI 스펙 (JSON)
              </a>
              <span className="text-gray-300">|</span>
              <Link href="/sell" className="text-blue-600 hover:underline">판매자 등록</Link>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">기본 URL</h2>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm">
              <p>프로덕션: https://booksell.kr/api</p>
              <p>개발: http://localhost:3000/api</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">인증</h2>
            <p className="text-gray-600 mb-4">
              북셀 API는 Supabase Auth를 사용합니다. 로그인 후 발급받은 JWT 토큰을
              Authorization 헤더에 포함하세요.
            </p>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm">
              Authorization: Bearer YOUR_JWT_TOKEN
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">엔드포인트</h2>

            <article className="bg-white border rounded-lg p-6 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-mono">GET</span>
                <span className="font-mono">/ebooks</span>
              </div>
              <p className="text-gray-600 mb-4">전자책 목록을 조회합니다.</p>
              <h4 className="font-semibold mb-2">파라미터</h4>
              <table className="w-full text-sm mb-4">
                <thead><tr className="border-b"><th className="text-left py-2">이름</th><th className="text-left py-2">타입</th><th className="text-left py-2">설명</th></tr></thead>
                <tbody>
                  <tr className="border-b"><td className="py-2 font-mono">page</td><td className="py-2">integer</td><td className="py-2">페이지 번호 (기본값: 1)</td></tr>
                  <tr className="border-b"><td className="py-2 font-mono">limit</td><td className="py-2">integer</td><td className="py-2">페이지당 항목 수 (최대: 100)</td></tr>
                  <tr className="border-b"><td className="py-2 font-mono">category</td><td className="py-2">string</td><td className="py-2">카테고리 필터</td></tr>
                  <tr><td className="py-2 font-mono">search</td><td className="py-2">string</td><td className="py-2">제목/설명 검색어</td></tr>
                </tbody>
              </table>
            </article>

            <article className="bg-white border rounded-lg p-6 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-mono">GET</span>
                <span className="font-mono">/ebooks/:id</span>
              </div>
              <p className="text-gray-600">특정 전자책의 상세 정보와 리뷰를 조회합니다.</p>
            </article>

            <article className="bg-white border rounded-lg p-6 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-mono">POST</span>
                <span className="font-mono">/ebooks</span>
              </div>
              <p className="text-gray-600">새 전자책을 등록합니다. 판매자 권한이 필요합니다.</p>
            </article>

            <article className="bg-white border rounded-lg p-6 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-mono">POST</span>
                <span className="font-mono">/auth/login</span>
              </div>
              <p className="text-gray-600">이메일과 비밀번호로 로그인합니다.</p>
            </article>

            <article className="bg-white border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-mono">GET</span>
                <span className="font-mono">/my-books</span>
              </div>
              <p className="text-gray-600">구매/대여한 전자책 목록을 조회합니다. 인증 필요.</p>
            </article>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">카테고리 목록</h2>
            <div className="bg-white border rounded-lg p-4">
              <div className="flex flex-wrap gap-2">
                {['경제/금융', '자기계발', '건강/의학', '취미/실용', 'IT/프로그래밍', '인문/사회', '소설/에세이', '기타'].map(cat => (
                  <span key={cat} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{cat}</span>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">지원</h2>
            <p className="text-gray-600">
              API 관련 문의는 <a href="mailto:support@booksell.kr" className="text-blue-600 hover:underline">support@booksell.kr</a>로 연락주세요.
            </p>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}

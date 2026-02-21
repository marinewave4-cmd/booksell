import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

// 메인 페이지는 Server Component로 변경 (SEO 최적화)
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          전자책을 <span className="text-blue-600">대여</span>하고<br />
          <span className="text-blue-600">판매</span>하는 가장 쉬운 방법
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          북셀에서 다양한 전자책을 저렴하게 대여하거나,<br className="hidden sm:block" />
          직접 작성한 전자책을 판매해보세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/books"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/25"
          >
            전자책 둘러보기
          </Link>
          <Link
            href="/sell"
            className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition"
          >
            판매자 등록
          </Link>
        </div>

        {/* 신뢰 지표 */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>안전한 결제</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>복제 방지</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>자동 정산</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16" aria-labelledby="features-title">
        <h2 id="features-title" className="text-3xl font-bold text-center mb-12">왜 북셀인가요?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            title="부담없는 대여"
            description="7일 2,900원부터 부담없이 전자책을 대여하세요"
          />
          <FeatureCard
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            }
            title="쉬운 판매"
            description="PDF만 올리면 바로 판매 시작. 수수료 15%만"
          />
          <FeatureCard
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            }
            title="자동 정산"
            description="매월 자동으로 판매 수익이 정산됩니다"
          />
          <FeatureCard
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            title="안전한 거래"
            description="콘텐츠 보호 시스템으로 불법 복제 방지"
          />
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 py-16" aria-labelledby="pricing-title">
        <div className="max-w-6xl mx-auto px-4">
          <h2 id="pricing-title" className="text-3xl font-bold text-center mb-4">가격 정책</h2>
          <p className="text-center text-gray-600 mb-12">투명하고 합리적인 가격</p>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <article className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-md transition">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                구매자
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex justify-between items-center">
                  <span>7일 대여</span>
                  <span className="font-semibold text-gray-900">2,900원~</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>30일 대여</span>
                  <span className="font-semibold text-gray-900">4,900원~</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>영구 소장</span>
                  <span className="font-semibold text-gray-900">7,900원~</span>
                </li>
              </ul>
            </article>
            <article className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-md transition">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                판매자
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex justify-between items-center">
                  <span>등록비</span>
                  <span className="font-semibold text-green-600">무료</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>판매 수수료</span>
                  <span className="font-semibold text-gray-900">15%</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>정산</span>
                  <span className="font-semibold text-gray-900">매월 자동</span>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* API Section */}
      <section className="py-16" aria-labelledby="api-title">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="max-w-2xl">
              <h2 id="api-title" className="text-2xl md:text-3xl font-bold mb-4">
                AI 시대를 위한 API 제공
              </h2>
              <p className="text-blue-100 mb-6">
                REST API를 통해 전자책을 자동으로 등록하고 관리하세요.
                AI 에이전트, 자동화 도구와 쉽게 연동할 수 있습니다.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/api-docs"
                  className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  API 문서 보기
                </Link>
                <Link
                  href="/sell"
                  className="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/10 transition"
                >
                  시작하기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center" aria-labelledby="cta-title">
        <div className="max-w-2xl mx-auto px-4">
          <h2 id="cta-title" className="text-3xl font-bold mb-4">지금 시작하세요</h2>
          <p className="text-gray-600 mb-8">
            이미 많은 크리에이터들이 북셀에서 전자책을 판매하고 있습니다.
          </p>
          <Link
            href="/sell"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/25"
          >
            무료로 판매자 등록하기
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <article className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition text-center">
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </article>
  )
}

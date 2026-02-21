'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function SellPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1" role="main">
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16" aria-labelledby="hero-title">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 id="hero-title" className="text-4xl font-bold mb-4">
              전자책을 판매하고<br />수익을 창출하세요
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              PDF만 올리면 끝! 수수료 15%만 받습니다.
            </p>
            <Link
              href="/login"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            >
              판매자 등록하기
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16" aria-labelledby="howto-title">
          <div className="max-w-6xl mx-auto px-4">
            <h2 id="howto-title" className="text-3xl font-bold text-center mb-12">어떻게 진행되나요?</h2>
            <ol className="grid md:grid-cols-4 gap-8" role="list">
              <StepCard number={1} emoji="📤" title="전자책 등록" desc="PDF와 표지를 업로드" />
              <StepCard number={2} emoji="✅" title="검토 승인" desc="24시간 내 검토 완료" />
              <StepCard number={3} emoji="💰" title="판매 시작" desc="마켓에 자동 노출" />
              <StepCard number={4} emoji="📊" title="수익 정산" desc="매월 자동 정산" />
            </ol>
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-white py-16" aria-labelledby="benefits-title">
          <div className="max-w-6xl mx-auto px-4">
            <h2 id="benefits-title" className="text-3xl font-bold text-center mb-12">판매자 혜택</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <article className="p-6">
                <div className="text-5xl font-bold text-blue-600 mb-2" aria-hidden="true">15%</div>
                <div className="text-gray-600">업계 최저 수수료</div>
                <p className="sr-only">판매 수수료가 15%로 업계 최저 수준입니다</p>
              </article>
              <article className="p-6">
                <div className="text-5xl font-bold text-blue-600 mb-2" aria-hidden="true">자동</div>
                <div className="text-gray-600">매월 자동 정산</div>
                <p className="sr-only">매월 자동으로 수익이 정산됩니다</p>
              </article>
              <article className="p-6">
                <div className="text-5xl font-bold text-blue-600 mb-2" aria-hidden="true">무료</div>
                <div className="text-gray-600">등록비 완전 무료</div>
                <p className="sr-only">전자책 등록비가 완전 무료입니다</p>
              </article>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16" aria-labelledby="faq-title">
          <div className="max-w-3xl mx-auto px-4">
            <h2 id="faq-title" className="text-3xl font-bold text-center mb-12">자주 묻는 질문</h2>
            <div className="space-y-4" role="list" aria-label="자주 묻는 질문 목록">
              <FaqItem q="어떤 전자책을 판매할 수 있나요?" a="직접 작성한 전자책이라면 모두 가능합니다. 저작권 침해, 불법 콘텐츠는 금지됩니다." />
              <FaqItem q="가격은 어떻게 설정하나요?" a="판매자가 직접 대여가/구매가를 설정할 수 있습니다." />
              <FaqItem q="정산은 언제 받나요?" a="매월 1일 정산, 15일 이내 입금됩니다." />
              <FaqItem q="불법 복제는 어떻게 막나요?" a="PDF 암호화, 워터마크 등 보호 기술을 적용합니다." />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-900 text-white py-16" aria-labelledby="cta-title">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 id="cta-title" className="text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
            <p className="text-gray-400 mb-8">5분 안에 판매자 등록을 완료할 수 있습니다</p>
            <Link
              href="/login"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              판매자 등록하기
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function StepCard({ number, emoji, title, desc }: { number: number, emoji: string, title: string, desc: string }) {
  return (
    <li className="text-center" role="listitem">
      <div className="relative inline-block mb-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl" aria-hidden="true">
          {emoji}
        </div>
        <div
          className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold flex items-center justify-center"
          aria-hidden="true"
        >
          {number}
        </div>
      </div>
      <h3 className="font-semibold mb-1">
        <span className="sr-only">단계 {number}: </span>
        {title}
      </h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </li>
  )
}

function FaqItem({ q, a }: { q: string, a: string }) {
  const [open, setOpen] = useState(false)
  const id = q.replace(/\s+/g, '-').toLowerCase()

  return (
    <div className="border rounded-lg overflow-hidden" role="listitem">
      <h3>
        <button
          onClick={() => setOpen(!open)}
          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          aria-expanded={open}
          aria-controls={`faq-answer-${id}`}
        >
          <span className="font-medium">{q}</span>
          <span className="text-2xl text-gray-400" aria-hidden="true">{open ? '−' : '+'}</span>
        </button>
      </h3>
      <div
        id={`faq-answer-${id}`}
        className={`px-6 py-4 bg-gray-50 text-gray-600 border-t ${open ? '' : 'hidden'}`}
        role="region"
        aria-labelledby={`faq-question-${id}`}
      >
        {a}
      </div>
    </div>
  )
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '전자책 판매하기',
  description: '북셀에서 전자책을 판매하고 수익을 창출하세요. 등록비 무료, 수수료 15%만. PDF만 올리면 바로 시작!',
  keywords: ['전자책 판매', '전자책 수익', 'PDF 판매', '크리에이터', '부수입'],
  openGraph: {
    title: '전자책 판매하기 | 북셀',
    description: '전자책을 판매하고 수익을 창출하세요. 등록비 무료, 수수료 15%만.',
  },
  alternates: {
    canonical: '/sell',
  },
}

// FAQ 구조화 데이터
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '어떤 전자책을 판매할 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '직접 작성한 전자책이라면 모두 가능합니다. 저작권 침해, 불법 콘텐츠는 금지됩니다.',
      },
    },
    {
      '@type': 'Question',
      name: '가격은 어떻게 설정하나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '판매자가 직접 대여가/구매가를 설정할 수 있습니다.',
      },
    },
    {
      '@type': 'Question',
      name: '정산은 언제 받나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '매월 1일 정산, 15일 이내 입금됩니다.',
      },
    },
    {
      '@type': 'Question',
      name: '불법 복제는 어떻게 막나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PDF 암호화, 워터마크 등 보호 기술을 적용합니다.',
      },
    },
  ],
}

export default function SellLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  )
}

import './globals.css'
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2563eb',
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: '북셀 - AI 시대의 전자책 마켓플레이스 | 대여 & 구매',
    template: '%s | 북셀',
  },
  description: '전자책을 대여하고 구매하는 가장 쉬운 방법. 7일 대여 2,900원부터. AI 자동 등록 API 제공. 수수료 15%, 자동 정산. 경제, 자기계발, 건강 등 다양한 전자책.',
  keywords: [
    '전자책', 'ebook', '전자책 판매', '전자책 마켓',
    '전자책 플랫폼', '전자책 대여', 'PDF 판매',
    'AI 전자책', '자동 등록', 'API', '북셀', 'booksell',
    '디지털 콘텐츠', '크리에이터', '수익화', '온라인 서점',
  ],
  authors: [{ name: '북셀', url: 'https://booksell.kr' }],
  creator: '북셀',
  publisher: '북셀',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    siteName: '북셀',
    title: '북셀 - AI 시대의 전자책 마켓플레이스',
    description: '전자책을 대여하고 구매하는 가장 쉬운 방법. AI 자동 등록 API 제공.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '북셀 - 전자책 마켓플레이스',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '북셀 - AI 시대의 전자책 마켓플레이스',
    description: '전자책을 대여하고 구매하는 가장 쉬운 방법',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'google-site-verification-code',
    other: {
      'naver-site-verification': 'naver-verification-code',
    },
  },
  alternates: {
    canonical: '/',
    languages: {
      'ko-KR': '/',
    },
  },
  category: 'ecommerce',
}

// AI 에이전트 및 검색엔진용 구조화 데이터
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '북셀',
  alternateName: ['BookSell', '북셀 전자책', 'booksell'],
  description: 'AI 시대의 전자책 마켓플레이스. 자동 등록 API 제공.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://booksell.kr',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://booksell.kr'}/books?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: 'ko-KR',
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '북셀',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://booksell.kr',
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://booksell.kr'}/logo.png`,
  description: '전자책 대여 및 구매 마켓플레이스',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'support@booksell.kr',
    availableLanguage: ['Korean'],
  },
}

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: '북셀 전자책 마켓플레이스',
  description: '전자책 대여(7일/30일) 및 영구 구매 서비스',
  provider: {
    '@type': 'Organization',
    name: '북셀',
  },
  serviceType: '전자책 판매 플랫폼',
  areaServed: {
    '@type': 'Country',
    name: 'South Korea',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: '전자책 카탈로그',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '7일 대여',
          description: '7일간 전자책 열람',
        },
        price: '2900',
        priceCurrency: 'KRW',
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '30일 대여',
          description: '30일간 전자책 열람',
        },
        price: '4900',
        priceCurrency: 'KRW',
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '영구 구매',
          description: '기간 제한 없이 전자책 소장',
        },
        price: '7900',
        priceCurrency: 'KRW',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://dofuyyubqgbcojybozro.supabase.co" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
      </head>
      <body className="antialiased text-gray-900 bg-white min-h-screen">{children}</body>
    </html>
  )
}

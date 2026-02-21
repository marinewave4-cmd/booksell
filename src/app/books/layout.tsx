import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '전자책 둘러보기',
  description: '경제, 자기계발, 건강, IT 등 다양한 분야의 전자책을 대여하거나 구매하세요. 7일 대여 2,900원부터.',
  openGraph: {
    title: '전자책 둘러보기 | 북셀',
    description: '다양한 분야의 전자책을 대여하거나 구매하세요',
  },
  alternates: {
    canonical: '/books',
  },
}

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

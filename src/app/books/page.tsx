'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BookCard from '@/components/ui/BookCard'
import { ebooksApi, type Ebook } from '@/lib/api'

const CATEGORIES = ['전체', '경제/금융', '자기계발', '건강/의학', '취미/실용', 'IT/프로그래밍', '인문/사회', '소설/에세이', '기타']

export default function BooksPage() {
  const [books, setBooks] = useState<Ebook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('전체')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // 검색어 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await ebooksApi.getList({
        search: debouncedSearch || undefined,
        category: category !== '전체' ? category : undefined,
      })
      if (response.success) {
        setBooks(response.data || [])
      }
    } catch (err: any) {
      setError(err.message || '전자책을 불러오는 중 오류가 발생했습니다')
      console.error('Failed to fetch books:', err)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, category])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full" role="main">
        <h1 className="sr-only">전자책 둘러보기</h1>

        {/* Search & Filter */}
        <section aria-label="검색 및 필터" className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <label htmlFor="search-input" className="sr-only">전자책 검색</label>
            <input
              id="search-input"
              type="search"
              placeholder="전자책 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-describedby="search-hint"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span id="search-hint" className="sr-only">제목이나 설명에서 검색합니다</span>
          </div>

          <div>
            <label htmlFor="category-select" className="sr-only">카테고리 선택</label>
            <select
              id="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full md:w-auto px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8" role="alert">
            <p>{error}</p>
            <button
              onClick={fetchBooks}
              className="mt-2 text-sm underline hover:no-underline"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* Book Grid */}
        {loading ? (
          <div className="flex justify-center py-20" aria-busy="true" aria-label="로딩 중">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {debouncedSearch || category !== '전체' ? '검색 결과가 없습니다' : '아직 등록된 전자책이 없습니다'}
            </h2>
            <p className="text-gray-600">
              {debouncedSearch || category !== '전체'
                ? '다른 검색어나 카테고리로 시도해보세요.'
                : '첫 번째 판매자가 되어보세요!'}
            </p>
            {!(debouncedSearch || category !== '전체') && (
              <Link
                href="/sell"
                className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                전자책 판매하기
              </Link>
            )}
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-4" aria-live="polite">
              {books.length}개의 전자책
            </p>
            <div
              className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              role="list"
              aria-label="전자책 목록"
            >
              {books.map(book => (
                <div key={book.id} role="listitem">
                  <BookCard
                    id={book.id}
                    title={book.title}
                    category={book.category}
                    coverUrl={book.cover_url}
                    sellerName={book.seller?.name || '판매자'}
                    rating={book.rating}
                    reviewsCount={book.reviews_count}
                    priceRent7={book.price_rent_7}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

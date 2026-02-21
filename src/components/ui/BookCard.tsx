'use client'

import Link from 'next/link'
import OptimizedImage from './OptimizedImage'

interface BookCardProps {
  id: string
  title: string
  category: string
  coverUrl: string | null
  sellerName: string
  rating: number
  reviewsCount: number
  priceRent7: number
}

export default function BookCard({
  id,
  title,
  category,
  coverUrl,
  sellerName,
  rating,
  reviewsCount,
  priceRent7,
}: BookCardProps) {
  return (
    <Link
      href={`/books/${id}`}
      className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={`${title} - ${category} - ${priceRent7.toLocaleString()}원`}
    >
      <article>
        <div className="aspect-[3/4] relative overflow-hidden">
          {coverUrl ? (
            <OptimizedImage
              src={coverUrl}
              alt={`${title} 표지`}
              fill
              className="w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <span className="text-white text-4xl font-bold" aria-hidden="true">
                {title[0]}
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="text-xs text-blue-600 mb-1">{category}</div>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {title}
          </h3>
          <div className="text-sm text-gray-500 mb-2">{sellerName}</div>
          <div className="flex items-center gap-2 text-sm mb-3" aria-label={`평점 ${rating?.toFixed(1) || '0.0'}, 리뷰 ${reviewsCount || 0}개`}>
            <span className="text-yellow-500" aria-hidden="true">★</span>
            <span>{rating?.toFixed(1) || '0.0'}</span>
            <span className="text-gray-400">({reviewsCount || 0})</span>
          </div>
          <div className="border-t pt-3">
            <div className="text-xs text-gray-500">7일 대여</div>
            <div className="font-bold text-blue-600">
              {priceRent7?.toLocaleString()}원
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

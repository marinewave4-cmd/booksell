'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string | null | undefined
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  fallbackText?: string
  fallbackGradient?: string
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  fallbackText,
  fallbackGradient = 'from-blue-500 to-purple-600',
}: OptimizedImageProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  // 이미지가 없거나 에러 발생시 폴백 표시
  if (!src || error) {
    return (
      <div
        className={`bg-gradient-to-br ${fallbackGradient} flex items-center justify-center ${className}`}
        style={!fill ? { width, height } : undefined}
      >
        {fallbackText && (
          <span className="text-white text-4xl font-bold">{fallbackText}</span>
        )}
      </div>
    )
  }

  // Supabase Storage URL 체크
  const isSupabaseImage = src.includes('supabase.co')

  if (fill) {
    return (
      <div className={`relative ${className}`}>
        {loading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
          onError={() => setError(true)}
          onLoad={() => setLoading(false)}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={!isSupabaseImage}
        />
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
        priority={priority}
        unoptimized={!isSupabaseImage}
      />
    </div>
  )
}

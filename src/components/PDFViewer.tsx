'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface PDFViewerProps {
  pdfUrl: string
  purchaseType: 'rent_7' | 'rent_30' | 'buy'
  expiresAt?: string | null
}

export default function PDFViewer({ pdfUrl, purchaseType, expiresAt }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [scale, setScale] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isExpired, setIsExpired] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pdfDocRef = useRef<any>(null)

  // 만료 확인
  useEffect(() => {
    if (expiresAt && purchaseType !== 'buy') {
      const checkExpiry = () => {
        const expired = new Date(expiresAt) < new Date()
        setIsExpired(expired)
      }
      checkExpiry()
      const interval = setInterval(checkExpiry, 60000) // 1분마다 확인
      return () => clearInterval(interval)
    }
  }, [expiresAt, purchaseType])

  // PDF.js 로드 및 렌더링
  useEffect(() => {
    const loadPdf = async () => {
      if (isExpired) return

      try {
        setIsLoading(true)

        // PDF.js 동적 로드
        const pdfjsLib = await import('pdfjs-dist')
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

        // PDF 로드
        const loadingTask = pdfjsLib.getDocument(pdfUrl)
        const pdf = await loadingTask.promise
        pdfDocRef.current = pdf
        setTotalPages(pdf.numPages)

        // 첫 페이지 렌더링
        await renderPage(1)
      } catch (err: any) {
        setError('PDF를 불러올 수 없습니다: ' + err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadPdf()
  }, [pdfUrl, isExpired])

  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfDocRef.current || !canvasRef.current) return

    const page = await pdfDocRef.current.getPage(pageNum)
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const viewport = page.getViewport({ scale: scale * 1.5 })
    canvas.height = viewport.height
    canvas.width = viewport.width

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise
  }, [scale])

  useEffect(() => {
    if (pdfDocRef.current) {
      renderPage(currentPage)
    }
  }, [currentPage, scale, renderPage])

  // 복사 방지
  useEffect(() => {
    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      return false
    }

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    const preventKeyboard = (e: KeyboardEvent) => {
      // Ctrl+C, Ctrl+P, Ctrl+S 방지
      if (e.ctrlKey && (e.key === 'c' || e.key === 'p' || e.key === 's')) {
        e.preventDefault()
        return false
      }
      // PrintScreen 방지
      if (e.key === 'PrintScreen') {
        e.preventDefault()
        return false
      }
    }

    document.addEventListener('copy', preventCopy)
    document.addEventListener('contextmenu', preventContextMenu)
    document.addEventListener('keydown', preventKeyboard)

    return () => {
      document.removeEventListener('copy', preventCopy)
      document.removeEventListener('contextmenu', preventContextMenu)
      document.removeEventListener('keydown', preventKeyboard)
    }
  }, [])

  if (isExpired) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">대여 기간이 만료되었습니다</h3>
          <p className="text-gray-600 mt-2">책을 계속 읽으려면 다시 대여하거나 구매해주세요.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">오류가 발생했습니다</h3>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="bg-gray-900 rounded-lg overflow-hidden select-none"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* 워터마크 오버레이 */}
      <div className="pointer-events-none absolute inset-0 z-10 opacity-10">
        <div className="absolute inset-0 flex items-center justify-center rotate-[-45deg]">
          <span className="text-4xl text-white font-bold whitespace-nowrap">
            북셀 - 무단 복제 금지
          </span>
        </div>
      </div>

      {/* 상단 컨트롤 */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-2 rounded bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span className="text-white text-sm">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="p-2 rounded bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale(Math.max(0.5, scale - 0.25))}
            className="p-2 rounded bg-gray-700 text-white hover:bg-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-white text-sm w-16 text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale(Math.min(2, scale + 0.25))}
            className="p-2 rounded bg-gray-700 text-white hover:bg-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {expiresAt && purchaseType !== 'buy' && (
          <div className="text-yellow-400 text-sm">
            만료: {new Date(expiresAt).toLocaleDateString('ko-KR')}
          </div>
        )}
      </div>

      {/* PDF 캔버스 */}
      <div className="relative overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
        <div className="flex justify-center p-4">
          <canvas
            ref={canvasRef}
            className="shadow-2xl"
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      </div>
    </div>
  )
}

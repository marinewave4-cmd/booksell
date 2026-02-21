'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const CATEGORIES = [
  '경제/금융',
  '자기계발',
  '건강/의학',
  '취미/실용',
  'IT/프로그래밍',
  '인문/사회',
  '소설/에세이',
  '기타',
]

export default function UploadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)

  const pdfInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    price_rent_7: 2900,
    price_rent_30: 4900,
    price_buy: 7900,
  })

  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string>('')

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('PDF 파일만 업로드 가능합니다')
        return
      }
      if (file.size > 100 * 1024 * 1024) { // 100MB
        setError('파일 크기는 100MB 이하여야 합니다')
        return
      }
      setPdfFile(file)
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!pdfFile) {
      setError('PDF 파일을 업로드해주세요')
      return
    }

    if (!formData.category) {
      setError('카테고리를 선택해주세요')
      return
    }

    setLoading(true)
    setError('')

    try {
      // 1. PDF 파일 업로드
      setUploadProgress(10)
      const pdfFormData = new FormData()
      pdfFormData.append('file', pdfFile)
      pdfFormData.append('type', 'pdf')

      const pdfRes = await fetch('/api/upload', {
        method: 'POST',
        body: pdfFormData,
      })

      if (!pdfRes.ok) {
        const data = await pdfRes.json()
        throw new Error(data.error || 'PDF 업로드에 실패했습니다')
      }

      const { url: pdfUrl, pageCount } = await pdfRes.json()
      setUploadProgress(50)

      // 2. 표지 이미지 업로드 (선택사항)
      let coverUrl = ''
      if (coverFile) {
        const coverFormData = new FormData()
        coverFormData.append('file', coverFile)
        coverFormData.append('type', 'cover')

        const coverRes = await fetch('/api/upload', {
          method: 'POST',
          body: coverFormData,
        })

        if (coverRes.ok) {
          const coverData = await coverRes.json()
          coverUrl = coverData.url
        }
      }
      setUploadProgress(75)

      // 3. 전자책 등록
      const ebookRes = await fetch('/api/ebooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          pdf_url: pdfUrl,
          cover_url: coverUrl,
          page_count: pageCount,
          price_rent_7: formData.price_rent_7,
          price_rent_30: formData.price_rent_30,
          price_buy: formData.price_buy,
        }),
      })

      if (!ebookRes.ok) {
        const data = await ebookRes.json()
        throw new Error(data.error || '전자책 등록에 실패했습니다')
      }

      setUploadProgress(100)

      alert('전자책이 등록되었습니다. 검토 후 승인되면 판매가 시작됩니다.')
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold">새 전자책 등록</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 기본 정보 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">기본 정보</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="전자책 제목을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명 <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="전자책에 대한 상세한 설명을 입력하세요"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    카테고리 <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">카테고리 선택</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    태그
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="쉼표로 구분 (예: 투자, 주식, 재테크)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 파일 업로드 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">파일 업로드</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PDF 업로드 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PDF 파일 <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => pdfInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                    pdfFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {pdfFile ? (
                    <div>
                      <svg className="w-12 h-12 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-gray-600">{pdfFile.name}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-600">클릭하여 PDF 업로드</p>
                      <p className="text-xs text-gray-400 mt-1">최대 100MB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfChange}
                  className="hidden"
                />
              </div>

              {/* 표지 이미지 업로드 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  표지 이미지 (선택)
                </label>
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                    coverPreview ? 'border-green-500' : 'border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover preview" className="max-h-40 mx-auto" />
                  ) : (
                    <div>
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-600">클릭하여 이미지 업로드</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG (권장: 400x600)</p>
                    </div>
                  )}
                </div>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* 가격 설정 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">가격 설정</h2>
            <p className="text-sm text-gray-500 mb-4">
              플랫폼 수수료 15%가 적용됩니다. 정산금액은 자동으로 계산됩니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  7일 대여 (원)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.price_rent_7}
                  onChange={(e) => setFormData({ ...formData, price_rent_7: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">
                  정산 예상: {Math.round(formData.price_rent_7 * 0.82).toLocaleString()}원
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  30일 대여 (원)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.price_rent_30}
                  onChange={(e) => setFormData({ ...formData, price_rent_30: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">
                  정산 예상: {Math.round(formData.price_rent_30 * 0.82).toLocaleString()}원
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  영구 구매 (원)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.price_buy}
                  onChange={(e) => setFormData({ ...formData, price_buy: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">
                  정산 예상: {Math.round(formData.price_buy * 0.82).toLocaleString()}원
                </p>
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-end gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 text-gray-600 hover:text-gray-900"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  업로드 중... {uploadProgress}%
                </span>
              ) : (
                '전자책 등록'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

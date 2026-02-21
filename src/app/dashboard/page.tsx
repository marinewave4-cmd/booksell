'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Stats {
  totalSales: number
  thisMonth: number
  totalBooks: number
  pendingBooks: number
}

interface Ebook {
  id: string
  title: string
  sales_count: number
  price_buy: number
  status: string
  created_at: string
}

interface Transaction {
  id: string
  created_at: string
  type: string
  amount: number
  ebook: {
    title: string
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'books' | 'sales' | 'settings'>('overview')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({ totalSales: 0, thisMonth: 0, totalBooks: 0, pendingBooks: 0 })
  const [books, setBooks] = useState<Ebook[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [bankInfo, setBankInfo] = useState({ bank_name: '', bank_account: '', account_holder: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard')
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login')
          return
        }
        throw new Error(data.error)
      }

      setStats(data.stats)
      setBooks(data.books)
      setTransactions(data.transactions)
      setBankInfo(data.bankInfo)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveBankInfo = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/dashboard/bank', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bankInfo),
      })

      if (res.ok) {
        alert('정산 계좌가 저장되었습니다.')
      }
    } catch (error) {
      console.error('Failed to save bank info:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'rent_7': return '7일 대여'
      case 'rent_30': return '30일 대여'
      case 'buy': return '영구 구매'
      default: return type
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">북셀</Link>
          <div className="flex items-center gap-4">
            <Link href="/my-books" className="text-gray-600 hover:text-gray-900">내 책장</Link>
            <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700">로그아웃</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-8 w-fit">
          {[
            { key: 'overview', label: '개요' },
            { key: 'books', label: '내 전자책' },
            { key: 'sales', label: '판매 내역' },
            { key: 'settings', label: '설정' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === tab.key ? 'bg-white shadow text-gray-900' : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <StatCard label="총 수익" value={`${stats.totalSales.toLocaleString()}원`} />
              <StatCard label="이번 달" value={`${stats.thisMonth.toLocaleString()}원`} />
              <StatCard label="등록 전자책" value={`${stats.totalBooks}권`} />
              <StatCard label="심사 대기" value={`${stats.pendingBooks}권`} />
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <Link
                href="/dashboard/upload"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                새 전자책 등록
              </Link>
            </div>

            {/* Recent Sales */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold mb-4">최근 판매</h3>
              {transactions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">아직 판매 내역이 없습니다.</p>
              ) : (
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div>
                        <div className="font-medium">{tx.ebook?.title}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(tx.created_at).toLocaleDateString('ko-KR')} · {getTypeLabel(tx.type)}
                        </div>
                      </div>
                      <div className="font-semibold text-blue-600">+{tx.amount.toLocaleString()}원</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Books Tab */}
        {activeTab === 'books' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">내 전자책</h2>
              <Link
                href="/dashboard/upload"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                + 새 전자책 등록
              </Link>
            </div>

            {books.length === 0 ? (
              <div className="bg-white rounded-xl border p-12 text-center">
                <p className="text-gray-500 mb-4">아직 등록한 전자책이 없습니다.</p>
                <Link
                  href="/dashboard/upload"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  첫 전자책 등록하기
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">제목</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">판매</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">가격</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">상태</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map(book => (
                      <tr key={book.id} className="border-t">
                        <td className="px-6 py-4 font-medium">{book.title}</td>
                        <td className="px-6 py-4">{book.sales_count}건</td>
                        <td className="px-6 py-4">{book.price_buy.toLocaleString()}원</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            book.status === 'approved' ? 'bg-green-100 text-green-700' :
                            book.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {book.status === 'approved' ? '판매중' :
                             book.status === 'pending' ? '심사중' : '반려됨'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/dashboard/books/${book.id}`} className="text-blue-600 hover:underline text-sm">
                            관리
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Sales Tab */}
        {activeTab === 'sales' && (
          <div>
            <h2 className="text-xl font-bold mb-6">판매 내역</h2>
            {transactions.length === 0 ? (
              <div className="bg-white rounded-xl border p-12 text-center">
                <p className="text-gray-500">아직 판매 내역이 없습니다.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">날짜</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">전자책</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">유형</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">금액</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">정산 예상</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-t">
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(tx.created_at).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="px-6 py-4 font-medium">{tx.ebook?.title}</td>
                        <td className="px-6 py-4">{getTypeLabel(tx.type)}</td>
                        <td className="px-6 py-4 font-semibold text-blue-600">
                          +{tx.amount.toLocaleString()}원
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {Math.round(tx.amount * 0.82).toLocaleString()}원
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>정산 안내:</strong> 매월 15일에 전월 판매분이 정산됩니다.
                플랫폼 수수료 15% + PG 수수료 3.3%가 공제됩니다.
              </p>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold mb-6">정산 계좌 설정</h2>
            <div className="bg-white rounded-xl border p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">은행</label>
                <select
                  value={bankInfo.bank_name}
                  onChange={(e) => setBankInfo({ ...bankInfo, bank_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">은행 선택</option>
                  <option value="국민은행">국민은행</option>
                  <option value="신한은행">신한은행</option>
                  <option value="우리은행">우리은행</option>
                  <option value="하나은행">하나은행</option>
                  <option value="농협은행">농협은행</option>
                  <option value="기업은행">기업은행</option>
                  <option value="카카오뱅크">카카오뱅크</option>
                  <option value="토스뱅크">토스뱅크</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">계좌번호</label>
                <input
                  type="text"
                  value={bankInfo.bank_account}
                  onChange={(e) => setBankInfo({ ...bankInfo, bank_account: e.target.value })}
                  placeholder="계좌번호 (- 없이)"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">예금주명</label>
                <input
                  type="text"
                  value={bankInfo.account_holder}
                  onChange={(e) => setBankInfo({ ...bankInfo, account_holder: e.target.value })}
                  placeholder="예금주명"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSaveBankInfo}
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-6">API 키</h2>
              <div className="bg-white rounded-xl border p-6">
                <p className="text-gray-600 mb-4">
                  API를 사용하면 자동화 도구를 통해 전자책을 등록할 수 있습니다.
                </p>
                <Link
                  href="/api-docs"
                  className="text-blue-600 hover:underline"
                >
                  API 문서 보기 →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  )
}

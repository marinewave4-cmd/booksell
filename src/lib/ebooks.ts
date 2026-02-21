import { supabase, Ebook } from './supabase'

// 전자책 목록 조회
export async function getEbooks(options?: {
  category?: string
  search?: string
  page?: number
  limit?: number
}) {
  const { category, search, page = 1, limit = 20 } = options || {}
  const offset = (page - 1) * limit

  let query = supabase
    .from('ebooks')
    .select('*, seller:profiles(id, name)', { count: 'exact' })
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (category) {
    query = query.eq('category', category)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  const { data, count, error } = await query

  if (error) throw error
  return { data, total: count || 0 }
}

// 전자책 상세 조회
export async function getEbook(id: string) {
  const { data, error } = await supabase
    .from('ebooks')
    .select('*, seller:profiles(id, name, avatar_url)')
    .eq('id', id)
    .single()

  if (error) throw error

  // 조회수 증가
  await supabase
    .from('ebooks')
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq('id', id)

  return data
}

// 내 전자책 목록 (판매자용)
export async function getMyEbooks(sellerId: string) {
  const { data, error } = await supabase
    .from('ebooks')
    .select('*')
    .eq('seller_id', sellerId)
    .neq('status', 'deleted')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// 전자책 등록
export async function createEbook(ebook: {
  seller_id: string
  title: string
  description: string
  category: string
  tags?: string[]
  pdf_url: string
  cover_url?: string
  page_count?: number
  price_rent_7: number
  price_rent_30: number
  price_buy: number
}) {
  const { data, error } = await supabase
    .from('ebooks')
    .insert(ebook)
    .select()
    .single()

  if (error) throw error
  return data
}

// 전자책 수정
export async function updateEbook(id: string, updates: Partial<Ebook>) {
  const { data, error } = await supabase
    .from('ebooks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// 전자책 삭제 (소프트 삭제)
export async function deleteEbook(id: string) {
  const { error } = await supabase
    .from('ebooks')
    .update({ status: 'deleted' })
    .eq('id', id)

  if (error) throw error
}

// 리뷰 목록
export async function getReviews(ebookId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, user:profiles(id, name, avatar_url)')
    .eq('ebook_id', ebookId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// 리뷰 작성
export async function createReview(review: {
  user_id: string
  ebook_id: string
  purchase_id?: string
  rating: number
  content?: string
}) {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single()

  if (error) throw error
  return data
}

// 카테고리 목록
export const CATEGORIES = [
  '경제/금융',
  '자기계발',
  '건강/의학',
  '취미/실용',
  'IT/프로그래밍',
  '인문/사회',
  '소설/에세이',
  '기타',
] as const

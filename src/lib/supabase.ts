import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 타입 정의
export interface Profile {
  id: string
  email: string
  name: string | null
  role: 'buyer' | 'seller' | 'admin'
  avatar_url: string | null
  bank_name: string | null
  bank_account: string | null
  account_holder: string | null
  created_at: string
}

export interface Ebook {
  id: string
  seller_id: string
  title: string
  description: string | null
  category: string
  tags: string[]
  pdf_url: string | null
  cover_url: string | null
  page_count: number
  price_rent_7: number
  price_rent_30: number
  price_buy: number
  view_count: number
  sales_count: number
  rating: number
  reviews_count: number
  status: 'pending' | 'approved' | 'rejected' | 'deleted'
  created_at: string
  // 조인
  seller?: Profile
}

export interface Purchase {
  id: string
  user_id: string
  ebook_id: string
  type: 'rent_7' | 'rent_30' | 'buy'
  amount: number
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  expires_at: string | null
  created_at: string
  // 조인
  ebook?: Ebook
}

export interface Review {
  id: string
  user_id: string
  ebook_id: string
  rating: number
  content: string | null
  created_at: string
  // 조인
  user?: Profile
}

-- =====================================================
-- 북셀 데이터베이스 스키마
-- Supabase에서 SQL Editor로 실행하세요
-- =====================================================

-- 1. 사용자 프로필 테이블
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'admin')),
  avatar_url TEXT,
  -- 판매자 정보
  bank_name TEXT,
  bank_account TEXT,
  account_holder TEXT,
  -- 메타
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 전자책 테이블
CREATE TABLE ebooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  -- 파일
  pdf_url TEXT,
  cover_url TEXT,
  page_count INTEGER DEFAULT 0,
  -- 가격
  price_rent_7 INTEGER NOT NULL DEFAULT 2900,
  price_rent_30 INTEGER NOT NULL DEFAULT 4900,
  price_buy INTEGER NOT NULL DEFAULT 7900,
  -- 통계
  view_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  -- 상태
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'deleted')),
  rejection_reason TEXT,
  -- 메타
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 구매/대여 테이블
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  ebook_id UUID REFERENCES ebooks(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('rent_7', 'rent_30', 'buy')),
  amount INTEGER NOT NULL,
  -- 결제 정보
  payment_key TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  -- 대여 정보
  expires_at TIMESTAMPTZ,
  -- 메타
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 리뷰 테이블
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  ebook_id UUID REFERENCES ebooks(id) NOT NULL,
  purchase_id UUID REFERENCES purchases(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, ebook_id)
);

-- 5. 정산 테이블
CREATE TABLE settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES profiles(id) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_sales INTEGER NOT NULL DEFAULT 0,
  commission INTEGER NOT NULL DEFAULT 0,
  net_amount INTEGER NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. API 키 테이블 (자동화용)
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  key_hash TEXT NOT NULL,
  name TEXT DEFAULT 'Default',
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- =====================================================
-- 인덱스
-- =====================================================
CREATE INDEX idx_ebooks_seller ON ebooks(seller_id);
CREATE INDEX idx_ebooks_category ON ebooks(category);
CREATE INDEX idx_ebooks_status ON ebooks(status);
CREATE INDEX idx_purchases_user ON purchases(user_id);
CREATE INDEX idx_purchases_ebook ON purchases(ebook_id);
CREATE INDEX idx_reviews_ebook ON reviews(ebook_id);

-- =====================================================
-- RLS (Row Level Security) 정책
-- =====================================================

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- ebooks
ALTER TABLE ebooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved ebooks are viewable by everyone"
  ON ebooks FOR SELECT USING (status = 'approved' OR seller_id = auth.uid());

CREATE POLICY "Sellers can insert own ebooks"
  ON ebooks FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own ebooks"
  ON ebooks FOR UPDATE USING (auth.uid() = seller_id);

-- purchases
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases"
  ON purchases FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchases"
  ON purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT USING (true);

CREATE POLICY "Users can insert own reviews"
  ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- 트리거: 프로필 자동 생성
-- =====================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- 트리거: 리뷰 평점 업데이트
-- =====================================================
CREATE OR REPLACE FUNCTION update_ebook_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE ebooks SET
    rating = (SELECT AVG(rating) FROM reviews WHERE ebook_id = NEW.ebook_id),
    reviews_count = (SELECT COUNT(*) FROM reviews WHERE ebook_id = NEW.ebook_id)
  WHERE id = NEW.ebook_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_ebook_rating();

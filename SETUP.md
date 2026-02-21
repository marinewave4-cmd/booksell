# 북셀 - 전자책 마켓플레이스 설정 가이드

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
cd ebook-platform
npm install
```

### 2. 환경변수 설정
`.env.example`을 `.env.local`로 복사하고 값을 입력하세요.

### 3. 개발 서버 실행
```bash
npm run dev
```
→ http://localhost:3000 에서 확인

---

## 📋 필수 설정 체크리스트

### ✅ 1. Supabase 설정

1. [Supabase](https://supabase.com) 가입 및 프로젝트 생성
2. **Project Settings > API**에서 키 확인:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **SQL Editor**에서 `supabase-schema.sql` 실행
4. **Storage**에서 버킷 생성:
   - `ebooks` (PDF 저장용)
   - `covers` (표지 이미지 저장용)
5. Storage 정책 설정 (Public 읽기 허용)

### ✅ 2. 토스페이먼츠 설정

1. [토스페이먼츠 개발자센터](https://developers.tosspayments.com) 가입
2. **테스트 키** 발급:
   - `NEXT_PUBLIC_TOSS_CLIENT_KEY`
   - `TOSS_SECRET_KEY`
3. **정산대행 서비스** 신청 (선택사항이지만 권장)
4. **Webhook URL** 설정 (결제 완료 알림)

### ✅ 3. 소셜 로그인 설정 (선택)

#### 카카오 로그인
1. [Kakao Developers](https://developers.kakao.com) 앱 생성
2. **카카오 로그인** 활성화
3. Redirect URI 설정: `https://your-domain.com/api/auth/callback`
4. Supabase에서 Kakao Provider 설정

#### Google 로그인
1. [Google Cloud Console](https://console.cloud.google.com) OAuth 설정
2. OAuth 2.0 클라이언트 ID 생성
3. Redirect URI 설정
4. Supabase에서 Google Provider 설정

---

## 🌐 Vercel 배포

### 1. Vercel 프로젝트 연결
```bash
npm i -g vercel
vercel
```

### 2. 환경변수 설정
Vercel 대시보드 > Settings > Environment Variables에서:
- `NEXT_PUBLIC_SITE_URL`: 배포된 도메인 (예: https://booksell.kr)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_TOSS_CLIENT_KEY`
- `TOSS_SECRET_KEY`

### 3. 커스텀 도메인 설정
1. Vercel > Settings > Domains에서 도메인 추가
2. DNS 설정 (CNAME 또는 A 레코드)

---

## 💰 운영 체크리스트

### 법적 요구사항
- [ ] 통신판매업 신고 (기존 사업자에 업종 추가)
- [ ] 이용약관/개인정보처리방침 내용 검토
- [ ] 환불 정책 확정

### 결제/정산
- [ ] 토스페이먼츠 라이브 키로 교체
- [ ] 정산 계좌 등록
- [ ] 정산 주기 확인 (월 1회, 15일)

### 콘텐츠 관리
- [ ] 전자책 심사 기준 수립
- [ ] 저작권 침해 대응 절차

---

## 📁 프로젝트 구조

```
ebook-platform/
├── src/
│   ├── app/                    # Next.js App Router 페이지
│   │   ├── (auth)/login/       # 로그인/회원가입
│   │   ├── books/              # 전자책 목록/상세
│   │   ├── dashboard/          # 판매자 대시보드
│   │   ├── my-books/           # 내 책장
│   │   ├── payment/            # 결제 결과
│   │   ├── read/[id]/          # PDF 뷰어
│   │   └── api/                # API 라우트
│   ├── components/             # React 컴포넌트
│   │   ├── PaymentButton.tsx   # 결제 버튼
│   │   └── PDFViewer.tsx       # PDF 뷰어 (복사 방지)
│   └── lib/                    # 유틸리티
│       ├── supabase.ts         # Supabase 클라이언트
│       ├── auth.ts             # 인증 함수
│       ├── ebooks.ts           # 전자책 CRUD
│       └── payments.ts         # 결제 함수
├── public/
│   ├── openapi.json            # AI 에이전트용 API 스펙
│   ├── .well-known/ai-plugin.json  # AI 플러그인 정의
│   └── robots.txt              # 크롤러 설정
├── supabase-schema.sql         # 데이터베이스 스키마
├── vercel.json                 # Vercel 설정
└── .env.example                # 환경변수 템플릿
```

---

## 🔌 API 사용 (자동화용)

### 인증
```bash
# Bearer 토큰 방식
curl -H "Authorization: Bearer YOUR_API_KEY" https://booksell.kr/api/ebooks
```

### 전자책 목록 조회
```bash
GET /api/ebooks?category=경제/금융&search=퇴직연금
```

### 전자책 등록
```bash
POST /api/ebooks
Content-Type: application/json

{
  "title": "전자책 제목",
  "description": "설명",
  "category": "경제/금융",
  "pdf_url": "https://...",
  "price_rent_7": 2900,
  "price_rent_30": 4900,
  "price_buy": 7900
}
```

자세한 API 문서: `/api-docs` 페이지 참조

---

## 🤖 AI 자동화 연동

`retirement-automation` 프로젝트와 연동하여 자동 등록:

```python
from booksell.uploader import BookSellUploader

uploader = BookSellUploader(api_key="YOUR_API_KEY")
result = uploader.register_ebook(
    title="퇴직연금 수령 방법과 세금",
    description="퇴직연금을 현명하게 수령하는 방법",
    category="경제/금융",
    pdf_path="./output/week6.pdf",
    price_rent_7=2900,
    price_rent_30=4900,
    price_buy=7900
)
print(f"등록 완료: {result['id']}")
```

---

## ❓ 자주 묻는 질문

### Q: 수수료는 얼마인가요?
플랫폼 수수료 15% + PG 수수료 3.3% = 총 약 18.3%

### Q: 정산은 언제 되나요?
매월 15일에 전월 판매분이 정산됩니다.

### Q: 대여 기간이 끝나면?
자동으로 열람 권한이 만료됩니다. 재대여 또는 구매가 필요합니다.

### Q: PDF가 복사되면 어떡하나요?
- 복사/다운로드 방지 기능 적용
- 워터마크 표시
- 스크린샷 방지 (브라우저 한계 있음)

---

## 📞 지원

문제가 있으면 support@booksell.kr로 연락하세요.

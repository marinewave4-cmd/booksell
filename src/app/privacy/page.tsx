import Link from 'next/link'

export const metadata = {
  title: '개인정보처리방침',
  description: '북셀 개인정보처리방침',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">북셀</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">개인정보처리방침</h1>

        <div className="bg-white rounded-xl shadow-sm p-8 prose prose-gray max-w-none">
          <p className="text-gray-500 mb-6">시행일: 2024년 1월 1일</p>

          <p>
            북셀(이하 &quot;회사&quot;)은 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고
            개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.
          </p>

          <h2>1. 수집하는 개인정보의 항목</h2>
          <p>회사는 서비스 제공을 위해 다음의 개인정보를 수집합니다:</p>
          <h3>필수 항목</h3>
          <ul>
            <li>회원가입: 이메일, 비밀번호, 이름(닉네임)</li>
            <li>결제: 결제 정보(카드사, 카드번호 일부)</li>
            <li>판매자 등록: 은행명, 계좌번호, 예금주명</li>
          </ul>
          <h3>자동 수집 항목</h3>
          <ul>
            <li>접속 IP, 접속 일시, 서비스 이용기록, 기기 정보</li>
          </ul>

          <h2>2. 개인정보의 수집 및 이용목적</h2>
          <ol>
            <li>회원관리: 회원 식별, 서비스 이용, 불량회원 제재</li>
            <li>서비스 제공: 전자책 구매/대여/판매, 콘텐츠 제공</li>
            <li>결제/정산: 요금 결제, 판매대금 정산</li>
            <li>마케팅: 이벤트, 프로모션 안내 (동의 시)</li>
          </ol>

          <h2>3. 개인정보의 보유 및 이용기간</h2>
          <p>회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다:</p>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">보존 항목</th>
                <th className="border p-2">보존 기간</th>
                <th className="border p-2">보존 근거</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">계약 또는 청약철회 등에 관한 기록</td>
                <td className="border p-2">5년</td>
                <td className="border p-2">전자상거래법</td>
              </tr>
              <tr>
                <td className="border p-2">대금결제 및 재화 등의 공급에 관한 기록</td>
                <td className="border p-2">5년</td>
                <td className="border p-2">전자상거래법</td>
              </tr>
              <tr>
                <td className="border p-2">소비자의 불만 또는 분쟁처리에 관한 기록</td>
                <td className="border p-2">3년</td>
                <td className="border p-2">전자상거래법</td>
              </tr>
              <tr>
                <td className="border p-2">접속에 관한 기록</td>
                <td className="border p-2">3개월</td>
                <td className="border p-2">통신비밀보호법</td>
              </tr>
            </tbody>
          </table>

          <h2>4. 개인정보의 제3자 제공</h2>
          <p>회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:</p>
          <ul>
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          </ul>

          <h2>5. 개인정보 처리의 위탁</h2>
          <p>회사는 서비스 향상을 위해 다음과 같이 개인정보 처리를 위탁하고 있습니다:</p>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">수탁업체</th>
                <th className="border p-2">위탁 업무</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">토스페이먼츠</td>
                <td className="border p-2">결제 처리, 정산 대행</td>
              </tr>
              <tr>
                <td className="border p-2">Supabase</td>
                <td className="border p-2">데이터베이스 호스팅</td>
              </tr>
              <tr>
                <td className="border p-2">Vercel</td>
                <td className="border p-2">서비스 호스팅</td>
              </tr>
            </tbody>
          </table>

          <h2>6. 정보주체의 권리·의무 및 행사방법</h2>
          <p>이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다:</p>
          <ul>
            <li>개인정보 열람 요구</li>
            <li>오류 등이 있을 경우 정정 요구</li>
            <li>삭제 요구</li>
            <li>처리정지 요구</li>
          </ul>
          <p>위 권리 행사는 서비스 내 설정 메뉴 또는 고객센터를 통해 가능합니다.</p>

          <h2>7. 개인정보의 안전성 확보 조치</h2>
          <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>
          <ul>
            <li>개인정보의 암호화</li>
            <li>해킹 등에 대비한 기술적 대책</li>
            <li>개인정보에 대한 접근 제한</li>
            <li>개인정보 취급 직원의 최소화 및 교육</li>
          </ul>

          <h2>8. 개인정보 보호책임자</h2>
          <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다:</p>
          <ul>
            <li>개인정보 보호책임자: 대표</li>
            <li>연락처: support@booksell.kr</li>
          </ul>

          <h2>9. 개인정보 처리방침 변경</h2>
          <p>이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>

          <h2>부칙</h2>
          <p>이 개인정보처리방침은 2024년 1월 1일부터 적용됩니다.</p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:underline">홈으로 돌아가기</Link>
        </div>
      </main>
    </div>
  )
}

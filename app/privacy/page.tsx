import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보 처리방침 · 이용안내",
  description: "쑥쑥 포털 개인정보 처리방침과 정보 이용 관련 안내",
};

export default function PrivacyPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <header className="px-1">
        <span className="chip bg-lavender/60 text-ink">이용안내</span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-ink mt-2">🔒 개인정보 처리방침 · 이용안내</h1>
        <p className="text-ink/60 text-sm mt-1">최종 개정: 2026-07-07</p>
      </header>

      <Section title="1. 개인정보를 수집·저장하지 않습니다">
        <p>쑥쑥 포털은 회원가입이 없으며, 이름·연락처·주민번호 등 <b>어떤 개인정보도 서버에 수집·전송하지 않습니다.</b></p>
        <p className="mt-2">아기 프로필(생년월일·출생순위·지역), 준비물 체크, 신청 진행 상태 등 입력한 정보는
          <b> 사용자 기기(브라우저 localStorage)에만 저장</b>되며 외부로 전송되지 않습니다. 브라우저 데이터를 지우면 함께 삭제됩니다.</p>
      </Section>

      <Section title="2. 위치 정보">
        <p>의료 '내 주변' 검색 시에만 브라우저 위치 권한을 사용하며, 좌표는 해당 조회 요청에만 쓰이고 <b>저장하지 않습니다.</b> 권한은 언제든 거부·해제할 수 있습니다.</p>
      </Section>

      <Section title="3. 외부 공공 API">
        <p>지원금·의료·어린이집·약품 정보는 정부·공공기관 공개 API(data.go.kr, 서울 열린데이터광장, 아이사랑, 식약처 등)를 조회해 보여줍니다.
          조회 요청에는 개인을 식별할 수 있는 정보가 포함되지 않습니다.</p>
      </Section>

      <Section title="4. 쿠키·분석·광고">
        <p>현재 광고·추적 쿠키를 사용하지 않습니다. 추후 도입 시 이 방침을 개정하고 사전 고지합니다.</p>
      </Section>

      <Section title="5. 정보의 정확성과 책임 한계 (면책)">
        <ul className="list-disc pl-5 space-y-1">
          <li>본 서비스의 지원금·의료·약품·해열제 용량 등 모든 정보는 <b>참고용 일반 안내</b>이며, 공식 기관의 안내나 의사·약사의 진료·복약지도를 <b>대체하지 않습니다.</b></li>
          <li>금액·자격·기간은 수시로 바뀌며 지역 편차가 큽니다. 신청 전 반드시 <b>복지로·정부24·관할 보건소·시군구청</b>에서 최종 확인하세요.</li>
          <li>해열제 용량은 표준 지침 기반 계산일 뿐 제품 농도가 다를 수 있으니 <b>제품 라벨과 전문가 지시</b>를 우선하세요.</li>
          <li>정보 오류·지연으로 인한 손해에 대해 운영자는 법적 책임을 지지 않습니다.</li>
        </ul>
      </Section>

      <Section title="6. 응급 상황">
        <p>응급 시에는 서비스 정보에 의존하지 말고 즉시 <b>119</b>에 신고하세요.</p>
      </Section>

      <div className="card p-4 text-xs text-ink/60">
        문의: 본 서비스는 개인이 공공데이터를 활용해 만든 비영리 정보 안내 사이트입니다. 데이터 출처는 각 페이지 하단에 표기돼 있습니다.
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-5">
      <h2 className="font-extrabold text-ink mb-2">{title}</h2>
      <div className="text-sm text-ink/80 leading-relaxed">{children}</div>
    </section>
  );
}

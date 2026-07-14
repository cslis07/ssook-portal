// 지자체 출산지원 — 문서로 확인된 2026 수치만 구조화. 나머지는 /localgov 검색 안내.
// ⚠️ 금액·조건은 자주 바뀌므로 반드시 관할 시·군·구청·보건소 최종 확인.

export type GovProgram = { name: string; amount: string; cond?: string };

// 시·도 공통 지원 (해당 시도 거주자 전체 적용)
export const SIDO_SUPPORT: Record<string, GovProgram[]> = {
  "서울특별시": [
    { name: "서울형 산후조리경비", amount: "첫째 100 · 둘째 120 · 셋째+ 150만원", cond: "신청일 기준 거주 90일↑, 출생 180일 내 신청 (산모 카드 바우처, 서울 내 사용)" },
    { name: "임산부 교통비", amount: "첫째 70 · 둘째 80 · 셋째+ 100만원", cond: "임신 3개월~출산 6개월 내 신청, 대중교통·택시·유류비" },
    { name: "무주택가구 주거비", amount: "출생아 1명당 월 30만원 × 2년 = 720만원", cond: "2025.1.1 이후 출산 무주택가구" },
    { name: "35세 이상 임산부 의료비", amount: "임신 회당 최대 50만원", cond: "국민행복카드와 중복 불가" },
  ],
};

// 특정 시·군·구 추가 지원 (문서 확인분). 키: "시도 시군구"
export const GU_EXTRA: Record<string, GovProgram[]> = {
  "서울특별시 강남구": [{ name: "출산지원금", amount: "첫째·둘째 200 · 셋째 300만원", cond: "구 자체 (서울시 공통과 별도)" }],
  "서울특별시 성동구": [{ name: "출산지원금", amount: "첫째·둘째 100 · 셋째 350만원", cond: "구 자체" }],
  "경기도 동두천시": [
    { name: "출산장려금", amount: "첫째 100 · 둘째 150 · 셋째 250 · 넷째+ 500만원", cond: "현금성 지원 큰 대표 사례" },
    { name: "산후조리비", amount: "시 100 + 경기도 250만원", cond: "" },
  ],
  "충청북도 음성군": [{ name: "출산장려금", amount: "셋째 100 · 넷째 500만원 (분할)", cond: "주거자금 대출잔액 3% 지원 병행" }],
  "강원특별자치도 태백시": [
    { name: "난임시술비", amount: "최대 200만원", cond: "생애 1회 등 조건" },
    { name: "공공산후조리원", amount: "이용요금 90% 감면", cond: "" },
  ],
};

export function govSupportFor(sido: string, gu: string): { sido: GovProgram[]; gu: GovProgram[] } {
  return {
    sido: SIDO_SUPPORT[sido] || [],
    gu: GU_EXTRA[`${sido} ${gu}`] || [],
  };
}

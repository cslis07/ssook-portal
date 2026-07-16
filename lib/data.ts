export const HERO = {
  brand: "아이쑥쑥",
  tagline: "2026 대한민국 출산·육아 올인원",
  subtitle: "지원금부터 준비물, 개월별 가이드까지 한 곳에서 쑥쑥",
};

export type Support = {
  key: string;
  name: string;
  amount: string;
  detail: string;
  apply: string;
  category: "현금" | "바우처" | "감면" | "휴직";
  icon: string;
};

export const SUPPORTS: Support[] = [
  { key: "first", name: "첫만남이용권", amount: "첫째 200만 · 둘째↑ 300만", detail: "출생 후 2년 이내 사용. 국민행복카드 포인트.", apply: "행복출산 원스톱", category: "바우처", icon: "🎁" },
  { key: "parent0", name: "부모급여 (0세)", amount: "월 100만원", detail: "0~11개월 매월 25일 현금 지급.", apply: "복지로 / 행복출산", category: "현금", icon: "👶" },
  { key: "parent1", name: "부모급여 (1세)", amount: "월 50만원", detail: "12~23개월 매월 25일 현금 지급.", apply: "복지로 / 행복출산", category: "현금", icon: "🍼" },
  { key: "child", name: "아동수당", amount: "월 10~13만원", detail: "만 9세 미만. 비수도권·인구감소지역 추가.", apply: "복지로 / 행복출산", category: "현금", icon: "💝" },
  { key: "med", name: "임신·출산 진료비", amount: "단태아 100만 · 다태아 140만+", detail: "국민행복카드 바우처. 2세 미만 아동 진료에도 사용.", apply: "국민행복카드", category: "바우처", icon: "🏥" },
  { key: "elec", name: "출산가구 전기요금", amount: "30%, 월 1.6만원 한도", detail: "출생 후 3년. 신청한 시점부터 적용 (소급 불가).", apply: "한전 123 / 한전ON", category: "감면", icon: "💡" },
  { key: "gas", name: "도시가스 (다자녀)", amount: "동절기 월 6,000~18,000원", detail: "3자녀 이상 또는 사회배려대상.", apply: "도시가스사 / 정부24", category: "감면", icon: "🔥" },
  { key: "diaper", name: "기저귀 바우처", amount: "월 9만원", detail: "기초생활·차상위·한부모 등. 최대 24개월.", apply: "보건소 / 복지로", category: "바우처", icon: "🧷" },
  { key: "formula", name: "조제분유 바우처", amount: "월 11만원", detail: "모유수유 불가 사유 인정 시. 최대 24개월.", apply: "보건소 / 복지로", category: "바우처", icon: "🍼" },
  { key: "doula", name: "산모·신생아 건강관리", amount: "5~40일 산후도우미", detail: "출산예정 40일 전 ~ 출산 후 60일 신청.", apply: "보건소 / 복지로", category: "바우처", icon: "🤱" },
  { key: "leave", name: "육아휴직 급여 (1~3개월)", amount: "통상임금 100%, 月 250만원", detail: "사후지급금 폐지, 매월 전액 지급.", apply: "고용24", category: "휴직", icon: "💼" },
  { key: "leave2", name: "6+6 부모육아휴직제", amount: "최대 月 450만원", detail: "생후 18개월 내 부모 모두 사용 시 단계 상향.", apply: "고용24", category: "휴직", icon: "👨‍👩‍👧" },
];

export const TIMELINE = [
  {
    phase: "임신 확인 직후",
    color: "rose",
    icon: "🌸",
    items: [
      "산부인과에서 임신확인서 발급",
      "국민행복카드 임신·출산 진료비 신청 (100만원~)",
      "보건소 임산부 등록 → 엽산제·철분제·산전검사",
      "정부24 '맘편한 임신' 원스톱 신청",
      "직장 출산휴가·육아휴직 제도 확인",
    ],
  },
  {
    phase: "임신 12~20주",
    color: "lavender",
    icon: "🌷",
    items: [
      "산후조리원·산후도우미 비교",
      "어린이집 입소대기 구조 확인 (아이사랑)",
      "KTX·SRT 임산부 할인 등록",
      "태아보험은 보장만 비교, 사은품 가입 피하기",
    ],
  },
  {
    phase: "임신 28~36주",
    color: "mint",
    icon: "🌿",
    items: [
      "아기침대·카시트·속싸개 등 필수 준비물 (체크리스트 참고)",
      "출산가방 준비 (산모/아기/보호자)",
      "보건소 유축기 예약 (선착순 마감 주의)",
      "출산 예정 40일 전 → 산모·신생아 건강관리 신청",
    ],
  },
  {
    phase: "출생 직후 (60일 이내!)",
    color: "peach",
    icon: "👶",
    items: [
      "출생신고 + 행복출산 원스톱 일괄 신청",
      "첫만남이용권 · 부모급여 · 아동수당",
      "출산가구 전기요금 할인 (당일 신청! 소급 불가)",
      "지자체 출산축하금 · 산후조리비",
      "건강보험 피부양자 등록",
    ],
  },
  {
    phase: "출산 후 1~6개월",
    color: "butter",
    icon: "🍼",
    items: [
      "생후 14~35일 1차 영유아검진",
      "BCG · B형간염 예방접종",
      "북스타트 책꾸러미 수령",
      "고위험 임산부 의료비 (6개월 이내)",
      "장난감도서관 가입",
    ],
  },
];

export type Month = {
  month: string;
  tip: string;
  items: string;
  shots?: string;
  checkup?: string;
};

export const MONTHS: Month[] = [
  { month: "0개월", tip: "체중·소변·황달 관찰이 핵심. 수유 기록은 간단히.", items: "체온계, 수유등, 트림수건, 방수패드", shots: "BCG, B형간염 1차", checkup: "생후 14~35일 1차" },
  { month: "1개월", tip: "짧은 터미타임 시작. 첫 영유아검진 챙기기.", items: "흑백카드, 얇은 놀이매트", shots: "B형간염 2차" },
  { month: "2개월", tip: "울음 증가 시기. 예방접종 일정 확인.", items: "딸랑이, 머리 받쳐주는 아기띠", shots: "DTaP·IPV·Hib·PCV·로타 1차" },
  { month: "3개월", tip: "낮·밤 구분 취침 루틴.", items: "모빌, 플레이짐, 침대용 암막" },
  { month: "4개월", tip: "뒤집기 징후 → 속싸개 중단. 낙상 주의.", items: "치발기, 넓은 바닥매트", shots: "DTaP·IPV·Hib·PCV·로타 2차", checkup: "2차 영유아검진 (4~6개월)" },
  { month: "5개월", tip: "손으로 잡고 입으로 탐색. 이유식은 서두르지 않기.", items: "실리콘 턱받이, 이유식 스푼" },
  { month: "6개월", tip: "이유식 시작. 우유 수유는 계속 주식.", items: "발판 하이체어, 흡착식기", shots: "DTaP·IPV·Hib·PCV 3차, B형간염 3차, 인플루엔자 시작" },
  { month: "7개월", tip: "물건 옮겨잡기. 작은 물건 질식 위험 제거.", items: "소프트블록, 스태킹컵" },
  { month: "8개월", tip: "기기·잡고 서기. 집 전체 안전점검.", items: "안전문, 콘센트커버, 모서리 보호대" },
  { month: "9개월", tip: "손가락 집기. 식사는 반드시 앉아서.", items: "흡착볼, 빨대컵, 핑거푸드 매트", checkup: "3차 영유아검진 (9~12개월)" },
  { month: "10개월", tip: "가구 잡고 이동. 가구 전도 방지 필수.", items: "가구 고정장치, 밀기 장난감" },
  { month: "11개월", tip: "손짓·모방·이름 반응을 놀이로.", items: "보드북, 도형 맞추기" },
  { month: "12개월", tip: "걷지 않아도 정상 범위 넓음. 가족식 전환.", items: "유아 컵·스푼, 첫 신발", shots: "MMR, 수두, 일본뇌염 시작, A형간염 1차" },
  { month: "13~17개월", tip: "걷기·말하기 강요 X. 오르기 사고 주의.", items: "안정 밀차, 플랩북, 미끄럼방지 양말, 부드러운 공" },
  { month: "18개월", tip: "언어·가리키기·눈맞춤 관찰.", items: "굵은 크레용, 2~4조각 퍼즐", shots: "DTaP·IPV·Hib·PCV 추가, A형간염 2차", checkup: "4차 영유아검진 + 구강검진" },
  { month: "19~23개월", tip: "평행놀이가 흔함. 양치·손씻기 놀이처럼.", items: "그림카드, 큰 블록, 유아칫솔, 세면대 발판" },
  { month: "24개월", tip: "부모급여 종료. 가정양육수당 또는 보육료 전환 확인.", items: "유아 식기, 균형놀이 도구, 유아변기" },
];

export type ChecklistItem = { name: string; qty?: string; note?: string };
export type ChecklistCategory = { title: string; icon: string; items: ChecklistItem[] };

export const CHECKLIST: { mustHave: ChecklistCategory[]; later: ChecklistItem[]; avoid: ChecklistItem[] } = {
  mustHave: [
    {
      title: "수면",
      icon: "🛏️",
      items: [
        { name: "아기침대 (단단한 매트리스)", note: "범퍼·베개·포지셔너 NO" },
        { name: "방수커버", qty: "1~2개" },
        { name: "고정형 침대시트", qty: "2~3장" },
        { name: "수면조끼 / 슬립색", note: "계절에 맞게" },
        { name: "속싸개", qty: "2~3개" },
      ],
    },
    {
      title: "기저귀·위생",
      icon: "🧷",
      items: [
        { name: "신생아 기저귀", qty: "1~2팩", note: "샘플로 핏 테스트 후" },
        { name: "무향 물티슈" },
        { name: "방수 기저귀 교환매트" },
        { name: "발진크림" },
        { name: "디지털 체온계" },
        { name: "콧물흡입기 + 생리식염수" },
        { name: "아기 욕조 + 후드타월", qty: "타월 2장" },
      ],
    },
    {
      title: "의류",
      icon: "👕",
      items: [
        { name: "배냇저고리 / 바디수트", qty: "5~7벌" },
        { name: "우주복·내의", qty: "3~5벌" },
        { name: "손수건", qty: "20장" },
        { name: "턱받이·트림수건", qty: "5장+" },
        { name: "계절용 외출복", qty: "1~2벌" },
      ],
    },
    {
      title: "수유",
      icon: "🍼",
      items: [
        { name: "젖병", qty: "2~4개" },
        { name: "신생아용 젖꼭지" },
        { name: "젖병솔 + 건조대" },
        { name: "수유쿠션" },
        { name: "모유저장팩", qty: "소량" },
      ],
    },
    {
      title: "이동",
      icon: "🚗",
      items: [
        { name: "뒤보기 카시트", note: "법적 필수" },
        { name: "유모차 또는 신생아 호환 바구니" },
        { name: "아기띠는 출산 후 직접 착용 후 구매" },
      ],
    },
  ],
  later: [
    { name: "유축기", note: "보건소 대여 먼저 확인" },
    { name: "분유포트" },
    { name: "젖병소독기", note: "열탕·식기세척기로 대체 가능" },
    { name: "역류방지쿠션" },
    { name: "바운서" },
    { name: "아기 모니터" },
    { name: "기저귀 쓰레기통" },
    { name: "가습기" },
  ],
  avoid: [
    { name: "수면 포지셔너", note: "질식 위험" },
    { name: "신생아 베개" },
    { name: "침대 범퍼" },
    { name: "경사진 수면기구" },
    { name: "앉아서 타는 보행기", note: "발달 저해" },
    { name: "목튜브" },
    { name: "신생아 신발", note: "양말로 충분" },
    { name: "손싸개 장기 사용", note: "감각 발달 방해" },
  ],
};

export const UTILITY = [
  {
    name: "출산가구 전기요금",
    icon: "💡",
    color: "butter",
    target: "출생 3년 미만 영아가 있는 가구",
    discount: "주택용 30%, 월 최대 16,000원",
    period: "출생일부터 3년",
    apply: "한전 ☎123 / 한전ON / 주민센터 / 행복출산",
    warning: "⚠️ 신청한 시점부터 적용 (소급 불가). 출생신고 당일 신청 권장.",
  },
  {
    name: "다자녀 전기요금",
    icon: "⚡",
    color: "peach",
    target: "자녀·손자녀 3명 이상",
    discount: "주택용 30%, 월 최대 16,000원",
    period: "상시",
    apply: "한전 ☎123",
    warning: "출산가구 할인과 중복 불가. 더 유리한 자격으로 등록.",
  },
  {
    name: "도시가스 (다자녀)",
    icon: "🔥",
    color: "rose",
    target: "18세 미만 자녀 3명 이상 / 기초·차상위·장애 등",
    discount: "동절기(12~3월) 월 6,000~18,000원 · 비동절기 월 1,650~2,470원",
    period: "상시",
    apply: "도시가스사 / 주민센터 / 정부24",
    warning: "매년 자격증명서 갱신 필요. 이사 시 통보.",
  },
  {
    name: "지역난방 (다자녀)",
    icon: "♨️",
    color: "lavender",
    target: "3자녀 이상",
    discount: "월 4,000원 × 12개월분을 한 번에 지급 (현금 48,000원)",
    period: "1년 단위",
    apply: "한국지역난방공사",
    warning: "민간 집단에너지 공급지역은 제도가 다를 수 있음.",
  },
  {
    name: "에너지바우처",
    icon: "🎟️",
    color: "mint",
    target: "기초생활수급 + 영유아·임산부·다자녀 등",
    discount: "1인 295,200원 ~ 4인 이상 701,300원 (2026년 기준)",
    period: "7.1 ~ 다음해 5.31",
    apply: "주민센터 / 복지로",
    warning: "하절기·동절기 칸막이 폐지로 유연하게 사용 가능.",
  },
  {
    name: "고효율 가전제품 환급",
    icon: "🏷️",
    color: "sky",
    target: "복지할인 가구 (다자녀·출산가구·기초 등)",
    discount: "구매가 15% (가구당 연 30만원 한도)",
    period: "예산 소진 시까지",
    apply: "한전 에너지마켓플레이스",
    warning: "거래내역서·영수증·명판·효율등급 라벨 사진 필수.",
  },
];

// detail: 서울시 「예방접종 종류별 실시방법」(news.seoul.go.kr/welfare/archives/229429) 기준
export const VACCINES: {
  name: string;
  when: string;
  detail?: { how?: string; side?: string; no?: string };
}[] = [
  {
    name: "BCG (결핵)", when: "생후 4주 이내 1회",
    detail: {
      how: "왼팔 삼각근 부위 피내주사 (1세 미만 0.05mL)",
      side: "국소 림프절염, 접종부위 농양·궤양, 켈로이드 등",
    },
  },
  {
    name: "B형간염", when: "출생 직후 → 1개월 → 6개월 (3회)",
    detail: {
      how: "영아는 대퇴부 전외측 근육주사 (10세 이하 0.5mL)",
      side: "접종부위 통증·종창, 발열, 구토, 피부발진 등",
    },
  },
  {
    name: "DTaP (디프테리아·파상풍·백일해)", when: "2·4·6개월, 15~18개월, 만4~6세",
    detail: {
      how: "0.5mL 피하 또는 근육주사 (영아는 대퇴부 전외측)",
      side: "접종부위 발적·부종·통증, 고열, 보챔 등",
      no: "이전 접종 후 심한 알레르기 반응, 접종 7일 내 원인불명 급성 뇌증",
    },
  },
  {
    name: "IPV (폴리오)", when: "2·4·6개월, 만4~6세",
    detail: {
      how: "0.5mL 피하 또는 근육주사",
      side: "접종부위 발적·경결·압통",
      no: "이전 접종 시 아나필락시스 반응",
    },
  },
  {
    name: "Hib (뇌수막염)", when: "2·4·6개월, 12~15개월",
    detail: {
      how: "0.5mL 근육주사",
      side: "접종부위 종창·발적·통증 (보통 1~2일 내 소실)",
      no: "생후 6주 미만 영아, 이전 접종 시 아나필락시스",
    },
  },
  {
    name: "PCV (폐렴구균)", when: "2·4·6개월, 12~15개월",
    detail: {
      how: "0.5mL 근육주사",
      side: "접종부위 통증·부종·발적, 발열",
    },
  },
  { name: "로타바이러스", when: "2·4(·6)개월 경구" },
  {
    name: "MMR (홍역·볼거리·풍진)", when: "12~15개월, 만4~6세",
    detail: {
      how: "상완 외측면 0.5mL 피하주사",
      side: "발열, 발진, 림프절종창, 관절통 등",
      no: "이전 접종 시 심한 알레르기 반응, 임신, 면역결핍",
    },
  },
  {
    name: "수두", when: "12~15개월",
    detail: {
      how: "상완 외측면 0.5mL 피하주사",
      side: "접종부위 통증·발적·종창, 발열, 두통 등",
      no: "백신 성분 중증 알레르기, 임신, 면역결핍",
    },
  },
  { name: "A형간염", when: "12~23개월 시작, 6개월 후 2차" },
  {
    name: "일본뇌염", when: "12개월~ (백신별 상이)",
    detail: {
      how: "불활성화: 12~35개월 2회+12개월 후 3차, 추가 만6·12세 / 약독화 생백신: 12~23개월 1회+12개월 후 2차 (피하주사)",
      side: "접종부위 통증·발적, 발열, 두통, 근육통, 구토 등",
    },
  },
  { name: "인플루엔자", when: "생후 6개월부터 매년" },
];

export const MISS_TOP7 = [
  "출생 후 전기요금 할인을 따로 신청하지 않는 경우",
  "부모급여를 출생 후 60일이 지나 신청하는 경우",
  "산후도우미를 출산 후 60일이 지나 신청하는 경우",
  "지자체 출산축하금의 거주기간·신청기한을 놓치는 경우",
  "보건소 유축기 예약을 출산 후에 알아보는 경우",
  "첫만남이용권·임신 진료비 바우처 사용기한을 넘기는 경우",
  "이사 후 전기·가스·난방 할인을 새 주소에 재등록하지 않는 경우",
];

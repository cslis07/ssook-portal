export type LocalFeature = {
  id: string;
  title: string;
  desc: string;
  icon: string;
  color: string;
  apiSource: string;
  endpoint: string;
  searchType: "sigungu" | "keyword" | "location";
  // sigungu 검색 시 전달 방식: "arcode"(어린이집 childcare 코드) | "name"(시군구명, 기본)
  regionParam?: "arcode" | "name";
};

export const LOCAL_FEATURES: LocalFeature[] = [
  {
    id: "daycare",
    title: "어린이집 찾기",
    desc: "우리 동네 어린이집 정원·연락처 조회",
    icon: "🏫",
    color: "bg-rose/40",
    apiSource: "보건복지부 아이사랑 (전국 어린이집 정보 cpmsapi021)",
    endpoint: "/api/daycare",
    searchType: "sigungu",
    regionParam: "arcode",
  },
  {
    id: "clinic",
    title: "예방접종 의료기관",
    desc: "어린이 국가예방접종 위탁 의료기관",
    icon: "💉",
    color: "bg-mint/50",
    apiSource: "질병관리청 (data.go.kr orglist3)",
    endpoint: "/api/clinic",
    searchType: "sigungu",
    regionParam: "arcode",
  },
  {
    id: "accident",
    title: "교통사고 다발지역",
    desc: "어린이보호구역 내 어린이 교통사고 다발지점",
    icon: "🚧",
    color: "bg-butter/50",
    apiSource: "한국도로교통공단 TAAS",
    endpoint: "/api/accident",
    searchType: "sigungu",
    regionParam: "arcode",
  },
  {
    id: "park-event",
    title: "어린이대공원 행사",
    desc: "서울 어린이대공원 진행 행사·체험",
    icon: "🎪",
    color: "bg-sky/50",
    apiSource: "서울시설공단",
    endpoint: "https://www.sisul.or.kr/open_content/childrenpark/",
    searchType: "keyword",
  },
];

export const SIGUNGU_TOP = [
  "서울 강남구", "서울 강서구", "서울 송파구", "서울 마포구", "서울 성동구",
  "경기 성남시", "경기 수원시", "경기 고양시", "경기 용인시", "경기 화성시",
  "인천 연수구", "인천 서구",
  "부산 해운대구", "대구 수성구", "대전 유성구", "광주 광산구",
  "세종 세종시", "울산 남구",
  "강원 춘천시", "충북 청주시", "충남 천안시",
  "전북 전주시", "전남 순천시",
  "경북 포항시", "경남 창원시", "제주 제주시",
];

export const SAMPLE_DATA: Record<string, any> = {
  daycare: {
    items: [
      { name: "행복어린이집", type: "국공립", capacity: 80, current: 76, address: "○○구 △△로 12", tel: "02-000-0000" },
      { name: "햇살가득어린이집", type: "민간", capacity: 45, current: 42, address: "○○구 △△로 38", tel: "02-000-0001" },
      { name: "꿈동산어린이집", type: "가정", capacity: 20, current: 18, address: "○○구 □□길 5", tel: "02-000-0002" },
    ],
  },
  clinic: {
    items: [
      { name: "○○소아청소년과의원", address: "○○구 △△로 11", tel: "02-000-1111", vaccines: "BCG·DTaP·MMR·로타·인플루엔자 전부" },
      { name: "△△의원 (가정의학과)", address: "○○구 △△로 50", tel: "02-000-2222", vaccines: "B형간염·DTaP·IPV·인플루엔자" },
    ],
  },
  playground: {
    items: [
      { name: "△△아파트 어린이놀이터", grade: "우수", lastCheck: "2026-03-15", facilities: "그네 2, 미끄럼틀 1, 시소 1", address: "○○구 △△동" },
      { name: "□□공원 놀이터", grade: "합격", lastCheck: "2026-01-20", facilities: "복합놀이대 1, 모래놀이장", address: "○○구 □□동" },
    ],
  },
  accident: {
    items: [
      { location: "○○초등학교 정문 앞 횡단보도", year: 2024, accidents: 3, deaths: 0, injured: 3, type: "어린이보호구역" },
      { location: "△△사거리 (○○초 인근 300m)", year: 2024, accidents: 2, deaths: 0, injured: 2, type: "보행어린이 다발" },
    ],
  },
  snack: {
    items: [
      { product: "○○유기농 쌀과자", maker: "○○푸드", certDate: "2025-08-12", expireDate: "2028-08-11", category: "과자류" },
      { product: "△△ 어린이 두유", maker: "△△식품", certDate: "2025-11-03", expireDate: "2028-11-02", category: "음료류" },
    ],
  },
};

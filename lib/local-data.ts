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


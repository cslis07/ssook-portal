// 이유식 재료 체크 데이터 — "먹어본 재료 기록"용. 시작 시기·순서를 처방하지 않는다.
// allergen: 식품등의 표시·광고에 관한 법률 시행규칙 [별표2] 알레르기 유발물질 표시 대상
//   (알류·우유·메밀·땅콩·대두·밀·고등어·게·새우·돼지고기·복숭아·토마토·아황산류·호두·닭고기·쇠고기·오징어·조개류·잣)

export type Food = { name: string; allergen?: boolean; note?: string };
export type FoodGroup = { id: string; label: string; icon: string; foods: Food[] };

export const FOOD_GROUPS: FoodGroup[] = [
  {
    id: "grain", label: "곡류", icon: "🍚",
    foods: [
      { name: "쌀" }, { name: "찹쌀" }, { name: "오트밀(귀리)" }, { name: "보리" },
      { name: "밀(빵·면)", allergen: true }, { name: "메밀", allergen: true },
    ],
  },
  {
    id: "veg", label: "채소", icon: "🥦",
    foods: [
      { name: "감자" }, { name: "고구마" }, { name: "애호박" }, { name: "단호박" }, { name: "브로콜리" },
      { name: "양배추" }, { name: "청경채" }, { name: "시금치" }, { name: "당근" }, { name: "무" },
      { name: "오이" }, { name: "양파" }, { name: "토마토", allergen: true },
    ],
  },
  {
    id: "fruit", label: "과일", icon: "🍎",
    foods: [
      { name: "사과" }, { name: "배" }, { name: "바나나" }, { name: "블루베리" }, { name: "수박" },
      { name: "참외" }, { name: "딸기" }, { name: "아보카도" }, { name: "복숭아", allergen: true },
    ],
  },
  {
    id: "protein", label: "고기·생선·달걀·콩", icon: "🥚",
    foods: [
      { name: "쇠고기", allergen: true }, { name: "닭고기", allergen: true }, { name: "돼지고기", allergen: true },
      { name: "흰살생선(대구 등)" }, { name: "고등어", allergen: true }, { name: "달걀", allergen: true },
      { name: "두부(대두)", allergen: true }, { name: "새우", allergen: true }, { name: "게", allergen: true },
      { name: "오징어", allergen: true }, { name: "조개류(굴·전복·홍합 등)", allergen: true },
    ],
  },
  {
    id: "dairy", label: "유제품·견과·기타", icon: "🧀",
    foods: [
      { name: "플레인 요거트", allergen: true, note: "우유 성분" }, { name: "치즈", allergen: true, note: "우유 성분" },
      { name: "땅콩(가루·버터)", allergen: true, note: "통땅콩은 질식 위험" },
      { name: "호두(가루)", allergen: true }, { name: "잣(가루)", allergen: true }, { name: "참깨" },
    ],
  },
];

// 돌(12개월) 전에는 주지 않는 것 — 널리 확립된 안전 수칙만
export const NOT_BEFORE_ONE = [
  { name: "꿀", why: "영아 보툴리누스증 위험 — 꿀이 든 음식 포함" },
  { name: "생우유(마시는 우유)", why: "돌 전에는 음료로 주지 않아요 (요거트·치즈 등 조리 재료는 별개)" },
];

export const FOOD_TIPS = [
  "새 재료는 한 번에 한 가지씩, 며칠 간격을 두고 먹여보면 반응을 확인하기 쉬워요.",
  "통견과류·통포도·방울토마토·떡 등은 질식 위험이 있어요. 잘게 자르거나 으깨서 주세요.",
  "시작 시기와 순서는 아이마다 달라요. 영유아검진이나 소아청소년과에서 상담하세요.",
];

export async function GET() {
  return Response.json({
    source: "static",
    notice: "선별진료소는 운영 상황이 자주 바뀌어요. 최신 정보는 질병관리청 또는 보건복지부 콜센터(129)에서 확인해주세요.",
    items: [
      { name: "○○보건소 호흡기클리닉", address: "○○구 △△로 1", tel: "02-000-0000", hours: "평일 09:00~17:00" },
      { name: "△△의료원 선별진료소", address: "○○구 □□길 22", tel: "02-000-1111", hours: "24시간" },
    ],
    links: [
      { label: "질병관리청 안내", href: "https://www.kdca.go.kr" },
      { label: "보건복지부 ☎129", href: "tel:129" },
    ],
  });
}

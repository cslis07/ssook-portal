import { apiResponse, getDataKey } from "@/lib/api-helper";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region") ?? "";
  const key = getDataKey();
  if (!key) return apiResponse("playground", null);

  try {
    const url = new URL("https://apis.data.go.kr/1741000/ChildPlaygroundInfoService/getChildPlaygroundInfoList");
    url.searchParams.set("serviceKey", key);
    url.searchParams.set("type", "json");
    url.searchParams.set("numOfRows", "30");
    url.searchParams.set("pageNo", "1");
    if (region) url.searchParams.set("sigunguNm", region);
    const r = await fetch(url, { next: { revalidate: 600 } });
    if (!r.ok) throw new Error(`status ${r.status}`);
    const data = await r.json();
    const rows: any[] = data?.response?.body?.items?.item ?? data?.items ?? [];
    const items = rows.map((x) => ({
      name: x.plygdSttsCdNm || x.facName || x.name,
      grade: x.insptRsltCdNm || x.grade || "정보 없음",
      lastCheck: x.insptYmd || x.lastCheck || "",
      facilities: x.facKindCdNm || x.facilities || "복합놀이대",
      address: x.rdnmadr || x.address,
    }));
    return apiResponse("playground", items);
  } catch (e: any) {
    return apiResponse("playground", null, `API 호출 실패: ${e.message}. 샘플 데이터로 표시합니다.`);
  }
}

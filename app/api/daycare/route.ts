import { apiResponse, getDataKey } from "@/lib/api-helper";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region") ?? "";
  const key = getDataKey();
  if (!key) return apiResponse("daycare", null);

  try {
    const url = new URL("https://apis.data.go.kr/1383000/gmis/childInfoService/childInfo");
    url.searchParams.set("serviceKey", key);
    url.searchParams.set("type", "json");
    url.searchParams.set("numOfRows", "30");
    url.searchParams.set("pageNo", "1");
    if (region) url.searchParams.set("address", region);
    const r = await fetch(url, { next: { revalidate: 600 } });
    if (!r.ok) throw new Error(`status ${r.status}`);
    const data = await r.json();
    const rows: any[] = data?.response?.body?.items?.item ?? data?.items ?? [];
    const items = rows.map((x) => ({
      name: x.crname || x.name,
      type: x.crtype || x.type,
      capacity: x.crcap || x.capacity,
      current: x.crcap_cur || x.current,
      address: x.craddr || x.address,
      tel: x.crtelno || x.tel,
    }));
    return apiResponse("daycare", items);
  } catch (e: any) {
    return apiResponse("daycare", null, `API 호출 실패: ${e.message}. 샘플 데이터로 표시합니다.`);
  }
}

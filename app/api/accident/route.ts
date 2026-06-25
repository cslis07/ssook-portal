import { apiResponse, getDataKey } from "@/lib/api-helper";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region") ?? "";
  const key = getDataKey();
  if (!key) return apiResponse("accident", null);

  try {
    const url = new URL("https://apis.data.go.kr/B552061/frequentzoneChild/getRestFrequentzoneChild");
    url.searchParams.set("serviceKey", key);
    url.searchParams.set("type", "json");
    url.searchParams.set("numOfRows", "30");
    url.searchParams.set("pageNo", "1");
    url.searchParams.set("searchYearCd", "2024");
    if (region) url.searchParams.set("siDo", region);
    const r = await fetch(url, { next: { revalidate: 3600 } });
    if (!r.ok) throw new Error(`status ${r.status}`);
    const data = await r.json();
    const rows: any[] = data?.items?.item ?? data?.response?.body?.items?.item ?? [];
    const items = rows.map((x) => ({
      location: x.spot_nm || x.location,
      year: Number(x.afos_year || x.year) || 2024,
      accidents: Number(x.occrrnc_cnt || x.accidents) || 0,
      deaths: Number(x.dth_dnv_cnt || x.deaths) || 0,
      injured: Number(x.injpsn_cnt || x.injured) || 0,
      type: "어린이보호구역",
    }));
    return apiResponse("accident", items);
  } catch (e: any) {
    return apiResponse("accident", null, `API 호출 실패: ${e.message}. 샘플 데이터로 표시합니다.`);
  }
}

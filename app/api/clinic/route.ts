import { apiResponse, getDataKey } from "@/lib/api-helper";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region") ?? "";
  const key = getDataKey();
  if (!key) return apiResponse("clinic", null);

  try {
    const url = new URL("https://apis.data.go.kr/1352000/ChildNipMandtMedicalInstitutionInfoService/getChildNipMandtMedicalInstitutionInfoList");
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
      name: x.orgnm || x.name,
      address: x.addr || x.address,
      tel: x.telno || x.tel,
      vaccines: x.vaccineNm || x.vaccines || "정보 없음",
    }));
    return apiResponse("clinic", items);
  } catch (e: any) {
    return apiResponse("clinic", null, `API 호출 실패: ${e.message}. 샘플 데이터로 표시합니다.`);
  }
}

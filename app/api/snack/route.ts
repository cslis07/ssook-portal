import { apiResponse } from "@/lib/api-helper";

const SNACK_KEY = process.env.FOODSAFETY_API_KEY || "6517ac40c168478492";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  try {
    const base = `http://openapi.foodsafetykorea.go.kr/api/${SNACK_KEY}/I0790/json/1/20`;
    const url = q ? `${base}/PRDLST_NM=${encodeURIComponent(q)}` : base;
    const r = await fetch(url, { next: { revalidate: 600 } });
    if (!r.ok) throw new Error(`status ${r.status}`);
    const data = await r.json();
    const rows: any[] = data?.I0790?.row ?? [];
    if (!rows.length) return apiResponse("snack", null, "검색 결과가 없거나 인증키 갱신이 필요해요.");
    const items = rows.map((x) => ({
      product: x.PRDLST_NM,
      maker: x.BSSH_NM,
      certDate: x.CTFC_GNT_YMD,
      expireDate: x.CTFC_EXP_YMD || x.CTFC_VLD_YMD,
      category: x.PRDLST_DCNM,
    }));
    return apiResponse("snack", items);
  } catch (e: any) {
    return apiResponse("snack", null, `API 호출 실패: ${e.message}. 샘플 데이터로 표시합니다.`);
  }
}

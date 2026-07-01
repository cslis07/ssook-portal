import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({ ignoreAttributes: true, parseTagValue: false, trimValues: true });

// 어린이 국가예방접종 위탁의료기관 — 질병관리청 (data.go.kr 1790387/orglist3)
// arcode(childcare 5자리)를 시도(앞2)·시군구(전체5)로 분해해 brtcCd/sggCd 로 전달.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const arcode = searchParams.get("arcode") || searchParams.get("region") || "";
  const key = process.env.DATA_API_KEY?.trim();
  if (!key) return apiResponse(null, "DATA_API_KEY 미설정 → 샘플 표시");
  if (!arcode) return apiResponse([], "지역을 선택해주세요.");

  const brtcCd = arcode.slice(0, 2);
  const sggCd = arcode;

  try {
    const url = `https://apis.data.go.kr/1790387/orglist3/getOrgList3?serviceKey=${key}&numOfRows=50&pageNo=1&brtcCd=${brtcCd}&sggCd=${sggCd}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(12000), next: { revalidate: 600 } });
    const text = await r.text();
    if (!text.trim().startsWith("<")) return apiResponse(null, "API 비정상 응답 → 샘플");
    const xml: any = parser.parse(text);
    let items = xml.response?.body?.items?.item ?? [];
    if (!Array.isArray(items)) items = items ? [items] : [];
    const mapped = items.map((x: any) => ({
      name: x.orgnm,
      address: x.orgAddr,
      tel: x.orgTlno,
      vaccines: "국가예방접종 지정",
    }));
    return Response.json({ source: "live", notice: mapped.length ? undefined : "이 지역 위탁기관 결과가 없어요.", items: mapped });
  } catch (e: any) {
    return apiResponse(null, `API 오류: ${e.message}`);
  }
}

function apiResponse(items: any[] | null, notice: string) {
  return Response.json({
    source: items ? "live" : "sample",
    notice,
    items: items ?? SAMPLE,
  });
}

const SAMPLE = [
  { name: "○○소아청소년과의원", address: "○○구 △△로 11", tel: "02-000-1111", vaccines: "BCG·DTaP·MMR·로타·인플루엔자" },
  { name: "△△의원 (가정의학과)", address: "○○구 △△로 50", tel: "02-000-2222", vaccines: "B형간염·DTaP·IPV·인플루엔자" },
];

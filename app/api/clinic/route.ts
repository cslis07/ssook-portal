import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({ ignoreAttributes: true, parseTagValue: false, trimValues: true });
const PAGE_SIZE = 20;

// 어린이 국가예방접종 위탁의료기관 — 질병관리청 (data.go.kr 1790387/orglist3)
// arcode(childcare 5자리)를 시도(앞2)·시군구(전체5)로 분해해 brtcCd/sggCd 로 전달.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const arcode = searchParams.get("arcode") || searchParams.get("region") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const key = process.env.DATA_API_KEY?.trim();
  if (!key) return sample("DATA_API_KEY 미설정 → 샘플 표시");
  if (!arcode) return Response.json({ source: "live", items: [], total: 0, page: 1, pageSize: PAGE_SIZE, notice: "지역을 선택해주세요." });

  const brtcCd = arcode.slice(0, 2);
  const sggCd = arcode;

  try {
    const url = `https://apis.data.go.kr/1790387/orglist3/getOrgList3?serviceKey=${key}&numOfRows=${PAGE_SIZE}&pageNo=${page}&brtcCd=${brtcCd}&sggCd=${sggCd}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(12000), next: { revalidate: 600 } });
    const text = await r.text();
    if (!text.trim().startsWith("<")) return sample("API 비정상 응답 → 샘플");
    const xml: any = parser.parse(text);
    const body = xml.response?.body || {};
    let items = body.items?.item ?? [];
    if (!Array.isArray(items)) items = items ? [items] : [];
    const mapped = items.map((x: any) => ({
      name: x.orgnm,
      address: x.orgAddr,
      tel: x.orgTlno,
      vaccines: "국가예방접종 지정",
    }));
    return Response.json({
      source: "live",
      items: mapped,
      total: Number(body.totalCount ?? mapped.length),
      page,
      pageSize: PAGE_SIZE,
      notice: mapped.length ? undefined : "이 지역 위탁기관 결과가 없어요.",
    }, { headers: { "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
  } catch (e: any) {
    return sample(`API 오류: ${e.message}`);
  }
}

function sample(notice: string) {
  const items = [
    { name: "○○소아청소년과의원", address: "○○구 △△로 11", tel: "02-000-1111", vaccines: "BCG·DTaP·MMR·로타·인플루엔자" },
    { name: "△△의원 (가정의학과)", address: "○○구 △△로 50", tel: "02-000-2222", vaccines: "B형간염·DTaP·IPV·인플루엔자" },
  ];
  return Response.json({ source: "sample", notice, items, total: items.length, page: 1, pageSize: PAGE_SIZE });
}

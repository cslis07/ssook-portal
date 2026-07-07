// 식약처 e약은요(의약품개요정보) — 약 효능·주의사항·상호작용·부작용 검색
// data.go.kr 1471000/DrbEasyDrugInfoService, DATA_API_KEY 사용.
// (참고: NomaDamas k-skill mfds-drug-safety 기능)
const ENDPOINT = "https://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList";

// 임산부·수유부 주의가 필요한 대표 키워드 (주의사항/상호작용 텍스트에서 하이라이트)
const PREGNANCY_FLAGS = ["임부", "임산부", "임신", "수유", "수유부", "태아", "모유"];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const key = process.env.DATA_API_KEY?.trim();

  if (!key) return Response.json({ error: "DATA_API_KEY 미설정" }, { status: 500 });
  if (!q) return Response.json({ items: [], total: 0, page: 1, pageSize: 10 });

  try {
    const url = `${ENDPOINT}?serviceKey=${key}&itemName=${encodeURIComponent(q)}&numOfRows=10&pageNo=${page}&type=json`;
    const r = await fetch(url, { signal: AbortSignal.timeout(12000), next: { revalidate: 3600 } });
    const text = await r.text();
    if (!text.trim().startsWith("{")) {
      return Response.json({ error: "약품 정보 API 비정상 응답", items: [] }, { status: 502 });
    }
    const data = JSON.parse(text);
    const body = data.body || {};
    let rows: any[] = body.items || [];
    if (!Array.isArray(rows)) rows = rows ? [rows] : [];
    const items = rows.map((x: any) => {
      const caution = clean(x.atpnQesitm);
      const interact = clean(x.intrcQesitm);
      const warn = clean(x.atpnWarnQesitm);
      const pregHit = PREGNANCY_FLAGS.some((f) =>
        (caution + interact + warn).includes(f)
      );
      return {
        name: x.itemName,
        company: x.entpName,
        image: x.itemImage || "",
        efficacy: clean(x.efcyQesitm),
        howto: clean(x.useMethodQesitm),
        warn,
        caution,
        interact,
        side: clean(x.seQesitm),
        storage: clean(x.depositMethodQesitm),
        pregnancyNote: pregHit,
      };
    });
    return Response.json(
      { items, total: Number(body.totalCount ?? items.length), page, pageSize: 10 },
      { headers: { "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
    );
  } catch (e: any) {
    const msg = e?.name === "TimeoutError" ? "응답 시간 초과" : String(e?.message || e);
    return Response.json({ error: msg, items: [] }, { status: 500 });
  }
}

function clean(s: any): string {
  return String(s ?? "").replace(/\n{2,}/g, "\n").trim();
}

import { XMLParser } from "fast-xml-parser";

const SERVICES: Record<string, string> = {
  emergency: "https://apis.data.go.kr/B552657/ErmctInfoInqireService",
  hospital: "https://apis.data.go.kr/B552657/HsptlAsembySearchService",
  pharmacy: "https://apis.data.go.kr/B552657/ErmctInsttInfoInqireService",
};

const ALLOWED = ["Q0", "Q1", "QD", "QT", "QN", "QZ", "ORD", "STAGE1", "STAGE2", "SM_TYPE", "WGS84_LON", "WGS84_LAT", "HPID", "pageNo", "numOfRows"];

const parser = new XMLParser({ ignoreAttributes: true, parseTagValue: false, trimValues: true });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = process.env.DATA_API_KEY?.trim();
  if (!key) {
    return Response.json({ error: "DATA_API_KEY 환경변수가 설정되지 않았습니다." }, { status: 500 });
  }

  const service = searchParams.get("service") || "";
  const op = searchParams.get("op") || "";
  const base = SERVICES[service];
  if (!base) return Response.json({ error: `알 수 없는 service: ${service}` }, { status: 400 });
  if (!op || !/^[A-Za-z]+$/.test(op)) return Response.json({ error: `유효하지 않은 op: ${op}` }, { status: 400 });

  const sp = new URLSearchParams();
  sp.set("serviceKey", key);
  sp.set("pageNo", "1");
  sp.set("numOfRows", "20");
  for (const k of ALLOWED) {
    const v = searchParams.get(k);
    if (v) sp.set(k, v);
  }

  try {
    const upstream = await fetch(`${base}/${op}?${sp.toString()}`, { signal: AbortSignal.timeout(12000) });
    const text = await upstream.text();
    if (!text.trim().startsWith("<")) {
      return Response.json({ error: "공공데이터 API 비정상 응답", raw: text.slice(0, 300) }, { status: 502 });
    }
    const xml: any = parser.parse(text);
    const body = xml.response?.body || {};
    const header = xml.response?.header || {};
    let items = body.items?.item ?? [];
    if (!Array.isArray(items)) items = items ? [items] : [];
    return Response.json({
      resultCode: header.resultCode ?? "",
      resultMsg: header.resultMsg ?? "",
      totalCount: Number(body.totalCount ?? items.length),
      items,
    });
  } catch (err: any) {
    const msg = err?.name === "TimeoutError" ? "응답 시간 초과" : String(err?.message || err);
    return Response.json({ error: msg }, { status: 500 });
  }
}

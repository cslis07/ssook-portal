import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({ ignoreAttributes: true, parseTagValue: false, trimValues: true });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = process.env.DATA_API_KEY?.trim();
  if (!key) {
    return Response.json({
      source: "sample",
      notice: "DATA_API_KEY 환경변수 설정 시 실시간 심야약국 정보 제공.",
      items: SAMPLE,
    });
  }
  const Q0 = searchParams.get("sido") || "";
  const Q1 = searchParams.get("sigungu") || "";
  const sp = new URLSearchParams({ serviceKey: key, pageNo: "1", numOfRows: "30", ORD: "NAME" });
  if (Q0) sp.set("Q0", Q0);
  if (Q1) sp.set("Q1", Q1);

  try {
    const url = `https://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyListInfoInqire?${sp}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(12000) });
    const text = await r.text();
    if (!text.trim().startsWith("<")) return Response.json({ source: "sample", notice: "API 비정상", items: SAMPLE });
    const xml: any = parser.parse(text);
    let items = xml.response?.body?.items?.item ?? [];
    if (!Array.isArray(items)) items = items ? [items] : [];

    const todayIdx = new Date().getDay();
    const dayKey = ["7", "1", "2", "3", "4", "5", "6"][todayIdx];
    const closeField = `dutyTime${dayKey}c`;

    const filtered = items
      .map((x: any) => ({
        name: x.dutyName,
        address: x.dutyAddr,
        tel: x.dutyTel1,
        todayClose: x[closeField] || "",
        isLate: isLateClose(x[closeField]),
      }))
      .filter((x: any) => x.isLate);

    return Response.json({
      source: "live",
      notice: filtered.length === 0 ? "오늘 22시 이후 운영 약국이 없어요. 응급실 약제부를 이용하세요." : undefined,
      items: filtered,
    });
  } catch (err: any) {
    return Response.json({ source: "sample", notice: `API 오류: ${err.message}`, items: SAMPLE });
  }
}

function isLateClose(t: string | undefined) {
  if (!t || t.length < 4) return false;
  const h = parseInt(t.slice(0, 2), 10);
  return h >= 22 || h < 6;
}

const SAMPLE = [
  { name: "○○24시약국", address: "서울 ○○구 △△로 88", tel: "02-000-0001", todayClose: "2400", isLate: true },
  { name: "△△심야약국", address: "서울 ○○구 □□로 12", tel: "02-000-0002", todayClose: "0200", isLate: true },
];

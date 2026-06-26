import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({ ignoreAttributes: true, parseTagValue: false, trimValues: true });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = process.env.DATA_API_KEY?.trim();
  if (!key) {
    return Response.json({
      source: "sample",
      notice: "DATA_API_KEY 환경변수를 설정하면 실시간 AED 위치를 받아와요.",
      items: SAMPLE_AED,
    });
  }
  const sido = searchParams.get("sido") || "";
  const sigungu = searchParams.get("sigungu") || "";
  const sp = new URLSearchParams({ serviceKey: key, pageNo: "1", numOfRows: "30" });
  if (sido) sp.set("Q0", sido);
  if (sigungu) sp.set("Q1", sigungu);

  try {
    const url = `https://apis.data.go.kr/B552657/AEDInfoInqireService/getAedLcinfoInqire?${sp}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(12000) });
    const text = await r.text();
    if (!text.trim().startsWith("<")) {
      return Response.json({ source: "sample", notice: "API 비정상 응답 → 샘플", items: SAMPLE_AED });
    }
    const xml: any = parser.parse(text);
    let items = xml.response?.body?.items?.item ?? [];
    if (!Array.isArray(items)) items = items ? [items] : [];
    const mapped = items.map((x: any) => ({
      name: x.org || x.buildPlace || "(이름 없음)",
      place: x.buildAddress || x.clerkTel || "",
      address: x.buildAddress || "",
      tel: x.clerkTel || x.mfd || "",
      lat: x.wgs84Lat,
      lon: x.wgs84Lon,
    }));
    return Response.json({ source: "live", items: mapped });
  } catch (err: any) {
    return Response.json({ source: "sample", notice: `API 오류: ${err.message}`, items: SAMPLE_AED });
  }
}

const SAMPLE_AED = [
  { name: "○○구청 1층 로비", place: "공공기관", address: "서울 ○○구 △△로 12", tel: "02-000-0000" },
  { name: "△△역 대합실", place: "지하철역", address: "서울 ○○구 □□동", tel: "1577-1234" },
  { name: "□□아파트 관리실", place: "공동주택", address: "서울 ○○구 ◇◇로 78", tel: "02-000-9999" },
];

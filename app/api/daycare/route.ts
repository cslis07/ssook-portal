import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({ ignoreAttributes: true, parseTagValue: false, trimValues: true });

// 어린이집 정보는 childcare.go.kr 전용 API(cpmsapi021)를 사용한다.
// data.go.kr 이 아니라 별도 인증키(CHILDCARE_API_KEY)와 arcode(childcare 시군구코드)가 필요.
const CHILDCARE_KEY = process.env.CHILDCARE_API_KEY?.trim();
const ENDPOINT = "https://api.childcare.go.kr/mediate/rest/cpmsapi021/cpmsapi021/request";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const arcode = searchParams.get("arcode") || "";

  if (!CHILDCARE_KEY) {
    return Response.json({
      source: "sample",
      notice: "CHILDCARE_API_KEY 환경변수를 설정하면 실시간 어린이집 정보를 받아와요.",
      items: SAMPLE,
    });
  }
  if (!arcode) {
    return Response.json({ source: "error", notice: "지역(arcode)을 선택해주세요.", items: [] });
  }

  try {
    const url = `${ENDPOINT}?key=${CHILDCARE_KEY}&arcode=${encodeURIComponent(arcode)}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(12000), next: { revalidate: 600 } });
    const text = await r.text();
    if (!text.trim().startsWith("<")) {
      return Response.json({ source: "sample", notice: "API 비정상 응답 → 샘플 표시", items: SAMPLE });
    }
    const xml: any = parser.parse(text);
    const resp = xml.response || {};
    if (resp.errcode && resp.errcode !== "" && !resp.item) {
      const msg = resp.errcode === "INFO-200" ? "이 지역에서 조회된 어린이집이 없어요." : `조회 실패: ${resp.errmsg || resp.errcode}`;
      return Response.json({ source: "live", notice: msg, items: [] });
    }
    let items = resp.item ?? [];
    if (!Array.isArray(items)) items = items ? [items] : [];
    const mapped = items.map((x: any) => ({
      name: x.crname,
      type: "",
      capacity: x.crcapat,
      current: "",
      address: x.craddr,
      tel: x.crtel,
      home: x.crhome || "",
    }));
    return Response.json({
      source: "live",
      notice: mapped.length >= 50 ? "상위 50개 어린이집만 표시돼요." : undefined,
      items: mapped,
    });
  } catch (e: any) {
    return Response.json({ source: "sample", notice: `API 오류: ${e.message}`, items: SAMPLE });
  }
}

const SAMPLE = [
  { name: "행복어린이집", type: "국공립", capacity: 80, current: 76, address: "○○구 △△로 12", tel: "02-000-0000" },
  { name: "햇살가득어린이집", type: "민간", capacity: 45, current: 42, address: "○○구 △△로 38", tel: "02-000-0001" },
  { name: "꿈동산어린이집", type: "가정", capacity: 20, current: 18, address: "○○구 □□길 5", tel: "02-000-0002" },
];

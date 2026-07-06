// 어린이보호구역 내 어린이 교통사고 다발지역 — 한국도로교통공단 TAAS (data.go.kr B552061)
// TAAS WAF 가 기본 요청을 차단하므로 User-Agent 헤더가 필수.
// arcode(childcare 5자리) → siDo(앞2) · guGun(뒤3).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const arcode = searchParams.get("arcode") || searchParams.get("region") || "";
  const key = process.env.DATA_API_KEY?.trim();
  if (!key) return sample("DATA_API_KEY 미설정 → 샘플 표시");
  if (!arcode || arcode.length < 5) return Response.json({ source: "live", notice: "지역을 선택해주세요.", items: [] });

  const siDo = arcode.slice(0, 2);
  const guGun = arcode.slice(2, 5);
  const year = "2023";

  try {
    const url = `https://apis.data.go.kr/B552061/schoolzoneChild/getRestSchoolzoneChild?serviceKey=${key}&searchYearCd=${year}&siDo=${siDo}&guGun=${guGun}&type=json&numOfRows=30&pageNo=1`;
    const r = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SsookPortal/1.0)" },
      signal: AbortSignal.timeout(12000),
      next: { revalidate: 3600 },
    });
    const text = await r.text();
    if (!text.trim().startsWith("{")) return sample("API 비정상 응답 → 샘플");
    const data = JSON.parse(text);
    let rows: any[] = data?.items?.item ?? [];
    if (!Array.isArray(rows)) rows = rows ? [rows] : [];
    const items = rows.map((x: any) => ({
      location: x.spot_nm || x.sido_sgg_nm,
      year: Number(year),
      accidents: Number(x.occrrnc_cnt) || 0,
      deaths: Number(x.dth_dnv_cnt) || 0,
      injured: (Number(x.se_dnv_cnt) || 0) + (Number(x.sl_dnv_cnt) || 0) + (Number(x.wnd_dnv_cnt) || 0),
      type: "어린이보호구역",
    }));
    return Response.json({
      source: "live",
      notice: items.length ? `${year}년 기준` : "이 지역 사고 다발지점 데이터가 없어요. (안전한 동네예요!)",
      items,
    }, { headers: { "cache-control": "public, s-maxage=86400, stale-while-revalidate=604800" } });
  } catch (e: any) {
    return sample(`API 오류: ${e.message}`);
  }
}

function sample(notice: string) {
  return Response.json({
    source: "sample",
    notice,
    items: [
      { location: "○○초등학교 정문 앞 횡단보도", year: 2023, accidents: 3, deaths: 0, injured: 3, type: "어린이보호구역" },
      { location: "△△사거리 (○○초 인근)", year: 2023, accidents: 2, deaths: 0, injured: 2, type: "어린이보호구역" },
    ],
  });
}

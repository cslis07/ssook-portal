const SEOUL_SERVICES: Record<string, string> = {
  all: "tvYeyakCOllect",
  culture: "ListPublicReservationCulture",
  education: "ListPublicReservationEducation",
  medical: "ListPublicReservationMedical",
  sport: "ListPublicReservationSport",
  institution: "ListPublicReservationInstitution",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = process.env.SEOUL_API_KEY?.trim();
  if (!key) return Response.json({ error: "SEOUL_API_KEY 환경변수가 필요합니다." }, { status: 500 });

  const detail = searchParams.get("detail");
  let svc: string, url: string;

  if (detail) {
    if (!/^[A-Za-z0-9]+$/.test(detail)) return Response.json({ error: `잘못된 SVCID: ${detail}` }, { status: 400 });
    svc = "ListPublicReservationDetail";
    url = `http://openapi.seoul.go.kr:8088/${key}/json/${svc}/1/5/${detail}`;
  } else {
    const cat = searchParams.get("cat") || "all";
    svc = SEOUL_SERVICES[cat];
    if (!svc) return Response.json({ error: `알 수 없는 cat: ${cat}` }, { status: 400 });
    let start = parseInt(searchParams.get("start") || "1", 10);
    let end = parseInt(searchParams.get("end") || `${start + 99}`, 10);
    if (!Number.isFinite(start) || start < 1) start = 1;
    if (!Number.isFinite(end) || end < start) end = start + 99;
    if (end - start > 999) end = start + 999;
    url = `http://openapi.seoul.go.kr:8088/${key}/json/${svc}/${start}/${end}/`;
  }

  try {
    // 서울 OpenAPI가 느려(수 초) 30분 캐시. 목록은 필요한 필드만 남겨 6.5MB→~0.5MB로 축소.
    const r = await fetch(url, { signal: AbortSignal.timeout(12000), next: { revalidate: 1800 } });
    const text = await r.text();
    let json: any;
    try { json = JSON.parse(text); } catch { return Response.json({ error: "서울 OpenAPI 비정상 응답", raw: text.slice(0, 300) }, { status: 502 }); }
    const root = json[svc] || json;
    const raw = Array.isArray(root?.row) ? root.row : [];
    // 상세조회(detail)는 전체 필드 유지, 목록은 슬림화
    const rows = detail ? raw : raw.map(slim);
    const body = JSON.stringify({
      code: root?.RESULT?.CODE ?? json?.RESULT?.CODE ?? "",
      message: root?.RESULT?.MESSAGE ?? json?.RESULT?.MESSAGE ?? "",
      total: Number(root?.list_total_count ?? rows.length),
      rows,
    });
    return new Response(body, {
      headers: {
        "content-type": "application/json; charset=utf-8",
        // CDN 엣지 캐시: 30분 신선 + 1시간 stale-while-revalidate
        "cache-control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch (err: any) {
    const msg = err?.name === "TimeoutError" ? "응답 시간 초과" : String(err?.message || err);
    return Response.json({ error: msg }, { status: 500 });
  }
}

// 목록 표시에 필요한 필드만 추림 (DTLCONT·좌표 등 대용량 필드 제거)
const KEEP = [
  "SVCID", "SVCNM", "SVCSTATNM", "PAYATNM", "USETGTINFO", "MINCLASSNM", "MAXCLASSNM",
  "PLACENM", "AREANM", "SVCURL", "IMGURL", "SVCOPNBGNDT", "SVCOPNENDDT", "RCPTBGNDT", "RCPTENDDT",
];
function slim(row: any) {
  const o: any = {};
  for (const k of KEEP) if (row[k] !== undefined) o[k] = row[k];
  return o;
}

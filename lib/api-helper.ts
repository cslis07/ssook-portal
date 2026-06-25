import { SAMPLE_DATA } from "./local-data";

export function apiResponse(feature: string, items: any[] | null, error?: string) {
  if (items && items.length > 0) {
    return Response.json({ source: "live", items });
  }
  return Response.json({
    source: "sample",
    notice: error || "실시간 API 키가 설정되지 않아 샘플 데이터를 보여드려요. (DATA_API_KEY 환경변수 설정 시 실데이터 전환)",
    items: SAMPLE_DATA[feature]?.items ?? [],
  });
}

export function getDataKey(): string | null {
  return process.env.DATA_API_KEY?.trim() || null;
}

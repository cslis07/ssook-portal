import { ImageResponse } from "next/og";

export const runtime = "edge";

// manifest.screenshots 용 프로모 이미지 (스토어 실제 스크린샷 대체용 임시 — 추후 실제 폰 캡처로 교체 권장)
// ?f=narrow(1080x1920, 모바일) | wide(1920x1080)
const FEATURES = [
  ["💝", "지원금 총정리"],
  ["🧮", "우리 아기 계산기"],
  ["🌡️", "해열제 용량"],
  ["🏥", "우리 동네 의료"],
  ["👶", "개월별 가이드"],
  ["💊", "약 안전 검색"],
];

export async function GET(req: Request) {
  const f = new URL(req.url).searchParams.get("f") || "narrow";
  const narrow = f !== "wide";
  const W = narrow ? 1080 : 1920;
  const H = narrow ? 1920 : 1080;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg,#FFF8F0,#FFEFE3 60%,#FFE0EA)",
          fontFamily: "sans-serif",
          color: "#3D2C2E",
          padding: narrow ? 80 : 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 120, height: 120, borderRadius: 120, background: "#FFB5C5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 68 }}>🌱</div>
          <div style={{ fontSize: 76, fontWeight: 900 }}>아이쑥쑥</div>
        </div>
        <div style={{ fontSize: 40, fontWeight: 700, color: "#6b5a5c", marginTop: 28 }}>2026 출산·육아 올인원</div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 22, marginTop: 70, maxWidth: narrow ? 900 : 1500 }}>
          {FEATURES.map(([ic, t]) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 16, background: "#fff", border: "3px solid #FFE2E9", borderRadius: 28, padding: "22px 34px", fontSize: 38, fontWeight: 800 }}>
              <span style={{ fontSize: 46 }}>{ic}</span>{t}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: W, height: H }
  );
}

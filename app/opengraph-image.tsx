import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "쑥쑥 포털 · 2026 출산·육아 지원금 올인원";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #FFD6BA 0%, #FFB5C5 55%, #D7C4F0 100%)",
          fontFamily: "sans-serif",
          color: "#3D2C2E",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 96, height: 96, borderRadius: 96,
              background: "#fff", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 56,
            }}
          >
            🌱
          </div>
          <div style={{ fontSize: 52, fontWeight: 900 }}>쑥쑥 포털</div>
        </div>
        <div style={{ fontSize: 68, fontWeight: 900, marginTop: 40, lineHeight: 1.2 }}>
          2026 출산·육아
        </div>
        <div style={{ fontSize: 68, fontWeight: 900, lineHeight: 1.2 }}>
          지원금 올인원 🍼
        </div>
        <div style={{ fontSize: 34, fontWeight: 600, marginTop: 32, color: "#5b4749" }}>
          우리 가족이 받을 지원금, 지금 계산해보세요
        </div>
      </div>
    ),
    { ...size }
  );
}

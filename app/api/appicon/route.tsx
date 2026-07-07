import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const size = Math.min(512, Math.max(64, Number(new URL(req.url).searchParams.get("size") || "512")));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg,#FFD6BA,#FFB5C5)",
          fontSize: size * 0.6,
        }}
      >
        🌱
      </div>
    ),
    { width: size, height: size }
  );
}

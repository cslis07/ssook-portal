import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "쑥쑥 포털 · 2026 출산·육아 올인원",
    short_name: "쑥쑥 포털",
    description: "2026 출산·육아 지원금, 준비물, 개월별 가이드, 우리 동네 의료까지 한 곳에.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF8F0",
    theme_color: "#FFB5C5",
    lang: "ko",
    icons: [
      { src: "/api/appicon?size=192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/api/appicon?size=512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/api/appicon?size=512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

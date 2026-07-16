import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "아이쑥쑥 · 2026 출산·육아 올인원",
    short_name: "아이쑥쑥",
    description: "2026 출산·육아 지원금, 준비물, 개월별 가이드, 우리 동네 의료·약 안전까지 한 곳에.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    dir: "ltr",
    background_color: "#FFF8F0",
    theme_color: "#FFB5C5",
    lang: "ko",
    categories: ["health", "lifestyle", "medical"],
    icons: [
      { src: "/api/appicon?size=192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/api/appicon?size=512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/api/appicon?size=512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    screenshots: [
      { src: "/api/screenshot?f=narrow", sizes: "1080x1920", type: "image/png", form_factor: "narrow", label: "아이쑥쑥 주요 기능" },
      { src: "/api/screenshot?f=wide", sizes: "1920x1080", type: "image/png", form_factor: "wide", label: "아이쑥쑥 주요 기능" },
    ],
    // 앱 아이콘 롱프레스 → 바로가기 메뉴
    shortcuts: [
      { name: "지원금 계산기", short_name: "계산기", url: "/calculator", icons: [{ src: "/api/appicon?size=192", sizes: "192x192" }] },
      { name: "해열제 용량", short_name: "해열제", url: "/fever", icons: [{ src: "/api/appicon?size=192", sizes: "192x192" }] },
      { name: "우리 동네", short_name: "우리 동네", url: "/local", icons: [{ src: "/api/appicon?size=192", sizes: "192x192" }] },
    ],
  };
}

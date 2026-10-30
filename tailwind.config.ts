import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // UI 2.0 팔레트 (ssook_2.0 원본 시안 샘플링). 토큰 이름은 유지해 기존 페이지가 그대로 새 색을 받음
        cream: "#FBF8F3",
        peach: "#FFD5B8",
        rose: "#E0714B",     // 강조(구 핑크 → 시안의 '쑥쑥' 코랄). 금액·포인트 텍스트 대비 개선
        lavender: "#D8D0F4",
        mint: "#BFE5CE",
        butter: "#FFE6A6",
        sky: "#C5DAFB",
        ink: "#0B193D",      // 진한 네이비 (구 브라운)
      },
      fontFamily: {
        cute: ["var(--font-cute)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 24px rgba(26, 40, 64, 0.06)",
        pop: "0 8px 0 rgba(11, 25, 61, 0.06)",
      },
      borderRadius: {
        blob: "24px",
      },
    },
  },
  plugins: [],
} satisfies Config;

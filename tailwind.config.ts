import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8F0",
        peach: "#FFD6BA",
        rose: "#FFB5C5",
        lavender: "#D7C4F0",
        mint: "#BFE7D9",
        butter: "#FFE8A3",
        sky: "#BFE0F5",
        ink: "#3D2C2E",
      },
      fontFamily: {
        cute: ["var(--font-cute)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 6px 20px rgba(255, 181, 197, 0.25)",
        pop: "0 8px 0 rgba(61, 44, 46, 0.08)",
      },
      borderRadius: {
        blob: "28px",
      },
    },
  },
  plugins: [],
} satisfies Config;

import "./globals.css";
import type { Metadata } from "next";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "쑥쑥 포털 · 2026 출산·육아 올인원",
  description: "지원금부터 준비물, 개월별 가이드까지 — 부모를 위한 다정한 안내서",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <NavBar />
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        <footer className="text-center text-xs text-ink/60 py-10">
          <p>🌱 쑥쑥 포털 · 2026년 기준 정부·공공기관 자료 요약</p>
          <p className="mt-1">최종 신청 전에는 복지로 · 정부24 · 관할 보건소·주민센터에서 다시 확인해주세요.</p>
        </footer>
      </body>
    </html>
  );
}

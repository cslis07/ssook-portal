import "./globals.css";
import type { Metadata, Viewport } from "next";
import NavBar from "@/components/NavBar";
import ServiceWorker from "@/components/ServiceWorker";

export const viewport: Viewport = {
  themeColor: "#FFB5C5",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ssook-portal.vercel.app"),
  title: {
    default: "아이쑥쑥 · 2026 출산·육아 지원금 올인원",
    template: "%s · 아이쑥쑥",
  },
  description:
    "2026년 부모급여·첫만남이용권·아동수당부터 출산 준비물, 개월별 가이드, 우리 동네 어린이집·의료까지. 우리 가족이 받을 지원금을 계산해보세요.",
  keywords: [
    "2026 부모급여", "첫만남이용권", "아동수당", "출산지원금", "출산 준비물",
    "육아 지원금", "지원금 계산기", "출산 혜택", "산후조리비", "육아휴직",
  ],
  applicationName: "아이쑥쑥",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "아이쑥쑥",
    title: "아이쑥쑥 · 2026 출산·육아 지원금 올인원",
    description:
      "우리 가족이 받을 2026년 출산·육아 지원금을 계산해보세요. 지원금·준비물·개월별 가이드·우리 동네 정보까지 한 곳에.",
    url: "https://ssook-portal.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "아이쑥쑥 · 2026 출산·육아 지원금 올인원",
    description: "우리 가족이 받을 2026년 출산·육아 지원금을 계산해보세요 🌱",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <ServiceWorker />
        <NavBar />
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        <footer className="text-center text-xs text-ink/60 py-10">
          <p>🌱 아이쑥쑥 · 2026년 기준 정부·공공기관 자료 요약</p>
          <p className="mt-1">최종 신청 전에는 복지로 · 정부24 · 관할 보건소·주민센터에서 다시 확인해주세요.</p>
          <p className="mt-2">
            <a href="/privacy" className="underline hover:text-rose">개인정보 처리방침 · 이용안내</a>
            <span className="mx-2">·</span>
            <a href="/guide.html" className="underline hover:text-rose">이용가이드</a>
          </p>
        </footer>
      </body>
    </html>
  );
}

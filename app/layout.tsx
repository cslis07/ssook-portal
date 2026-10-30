import "./globals.css";
import "./ui2.css";
import type { Metadata, Viewport } from "next";
import NavBar from "@/components/NavBar";
import MobileTabBar from "@/components/ui2/MobileTabBar";

export const viewport: Viewport = {
  themeColor: "#FFB5C5",
  // Android 15+ edge-to-edge 대응 — 시스템 바 뒤까지 그리고 safe-area로 인셋 처리
  viewportFit: "cover",
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
        {/* 스플래시 — 앱 진입 시 새싹이 자라는 로딩 화면(세션당 1회) */}
        {/* suppressHydrationWarning: 아래 인라인 스크립트가 하이드레이션 전에 class를 바꾸므로(기존 경고 해소, 동작 동일) */}
        <div id="splash" aria-hidden="true" suppressHydrationWarning>
          <div className="splash-inner">
            <span className="splash-badge"><span className="splash-sprout">🌱</span></span>
            <div className="splash-name">아이쑥쑥</div>
            <div className="splash-sub">2026 출산·육아 올인원</div>
          </div>
        </div>
        {/* SW 등록 조기화(스캐너 검출 포함) + 스플래시 제어 */}
        <script
          dangerouslySetInnerHTML={{
            __html: [
              "if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(function(){})}",
              "(function(){var s=document.getElementById('splash');if(!s)return;var seen=false;",
              "try{seen=!!sessionStorage.getItem('ssook-splash')}catch(e){}",
              "if(seen){s.classList.add('splash-skip');return}",
              "try{sessionStorage.setItem('ssook-splash','1')}catch(e){}",
              "setTimeout(function(){s.classList.add('splash-done')},1200)})();",
            ].join(""),
          }}
        />
        <div className="ss-shell">
          <NavBar />
          <main className="ss-main">{children}</main>
          <footer className="ss-footer">
            <p>🌱 <strong>아이쑥쑥</strong> · 2026년 기준 정부·공공기관 공개 자료 요약</p>
            <p className="mt-1 font-semibold" style={{ color: "#4B5567" }}>
              ※ 본 앱은 정부·공공기관이 운영하거나 정부와 제휴한 앱이 아니며, 어떠한 정부 기관도 대표하지 않습니다.
            </p>
            <p className="mt-1">앱의 정보는 아래 공식 출처의 공개 자료를 요약·안내한 참고용입니다. 최종 신청 전에는 반드시 공식 사이트·관할 기관에서 확인하세요.</p>
            <div className="ss-footer-links">
              <a href="https://www.bokjiro.go.kr" target="_blank" rel="noopener">복지로</a>
              <a href="https://www.gov.kr" target="_blank" rel="noopener">정부24</a>
              <a href="https://www.mohw.go.kr" target="_blank" rel="noopener">보건복지부</a>
              <a href="https://nip.kdca.go.kr" target="_blank" rel="noopener">예방접종도우미</a>
              <a href="https://www.nhis.or.kr" target="_blank" rel="noopener">국민건강보험공단</a>
              <a href="https://www.childcare.go.kr" target="_blank" rel="noopener">아이사랑</a>
            </div>
            <p className="ss-footer-links" style={{ marginTop: 12 }}>
              <a href="/privacy">개인정보 처리방침 · 이용안내</a>
              <a href="/guide.html">이용가이드</a>
            </p>
          </footer>
        </div>
        <MobileTabBar />
      </body>
    </html>
  );
}

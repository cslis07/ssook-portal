import HomeHero from "@/components/home/HomeHero";
import HomeBento from "@/components/home/HomeBento";
import QuickLinks from "@/components/home/QuickLinks";
import HomeMenu from "@/components/HomeMenu";
import AdSlot from "@/components/AdSlot";
import TodayPick from "@/components/TodayPick";

// UI 2.0 홈 — 원본 시안 순서: 히어로 → 3카드 + 동네 가로카드 → 4개 바로가기
// 아래(below the fold): 전체 메뉴 → 광고 → 오늘의 공공서비스 픽 → 광고 (기존 콘텐츠·광고 위치 유지)
export default function Home() {
  return (
    <div className="ss-home">
      <HomeHero />
      <HomeBento />
      <QuickLinks />
      <HomeMenu />
      <AdSlot />
      <TodayPick />
      <AdSlot />
    </div>
  );
}

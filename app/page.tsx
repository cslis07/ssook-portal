import TodayPick from "@/components/TodayPick";
import HomeMenu from "@/components/HomeMenu";
import AdSlot from "@/components/AdSlot";

export default function Home() {
  return (
    <div className="space-y-6">
      {/* 전체 메뉴 (아이콘 그리드 허브) — 맨 위 */}
      <HomeMenu />

      {/* 광고 (쿠팡 파트너스) */}
      <AdSlot />

      {/* 오늘의 공공서비스 픽 */}
      <TodayPick />

      {/* 광고 (하단) */}
      <AdSlot />
    </div>
  );
}

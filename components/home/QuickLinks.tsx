import Link from "next/link";
import { IconChevronRight } from "@/components/ui2/Icons";

// 원본 시안의 4개 바로가기. 부제는 실제 페이지 기능에 맞게 표기
// (시안의 '증상별 복용 가이드'·'검진·예방접종 예약'은 실제 기능과 달라 정정)
const QUICK = [
  { href: "/calculator", icon: "/ssook2/quick-calc.png", title: "지원금 계산기", sub: "우리 아이가 받을 수 있는 혜택은?" },
  { href: "/timeline", icon: "/ssook2/quick-calendar.png", title: "신청 일정", sub: "놓치지 않게 미리 확인해요" },
  { href: "/fever", icon: "/ssook2/quick-pill.png", title: "해열제 안내", sub: "몸무게별 복용량과 대처법" },
  { href: "/seoul", icon: "/ssook2/quick-building.png", title: "공공서비스 예약", sub: "체험·교육·시설 예약을 한 번에" },
];

export default function QuickLinks() {
  return (
    <nav className="ss-quick" aria-label="바로가기">
      {QUICK.map((q) => (
        <Link key={q.href} href={q.href}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={q.icon} alt="" aria-hidden="true" width={56} height={56} />
          <div><b>{q.title}</b><small>{q.sub}</small></div>
          <IconChevronRight size={20} strokeWidth={2.2} />
        </Link>
      ))}
    </nav>
  );
}

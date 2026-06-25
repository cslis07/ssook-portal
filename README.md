# 🌱 쑥쑥 포털

> 2026 대한민국 출산·육아 올인원 웹포털.
> 지원금 · 신청 타임라인 · 개월별 가이드 · 준비물 체크리스트 · 공과금 혜택 · 지원금 계산기.

## 스택
- Next.js 15 (App Router) + React 19
- TypeScript + Tailwind CSS
- 정적 배포 (Vercel)

## 로컬 실행
```bash
npm install
npm run dev
# http://localhost:3000
```

## GitHub + Vercel 배포
1. GitHub 새 저장소 생성 (예: `ssook-portal`)
2. ```bash
   git init
   git add .
   git commit -m "init: 쑥쑥 포털"
   git branch -M main
   git remote add origin https://github.com/<user>/ssook-portal.git
   git push -u origin main
   ```
3. [vercel.com/new](https://vercel.com/new) → Import → 이 저장소 선택 → Deploy
4. 도메인 연결 (예: `ssook.app`) — Vercel 프로젝트 → Settings → Domains

## 페이지
- `/` 홈 (핵심 지원금 6종 + 놓치는 7가지)
- `/timeline` 임신확인 → 출산후 6개월 신청 타임라인
- `/support` 지원금 12종 카테고리별 정리
- `/calendar` 0~24개월 발달·꿀팁·접종·검진
- `/checklist` 준비물 체크리스트 (브라우저 저장)
- `/utility` 전기·가스·난방 감면
- `/calculator` 우리 가족 지원금 계산기

## 데이터 출처
- 보건복지부, 한국전력공사, 국민건강보험공단, 고용노동부, 질병관리청, 아이사랑 포털 (2026년 기준)
- 정확한 신청은 복지로 / 정부24 / 관할 보건소·주민센터에서 최종 확인.

## 디자인
파스텔 톤 (cream / rose / peach / lavender / mint / butter / sky) 기반,
둥글둥글한 카드와 이모지 일러스트로 엄마·아빠가 편안하게 볼 수 있도록 했어요. 🌸

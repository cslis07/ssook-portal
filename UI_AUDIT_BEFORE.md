# 아이쑥쑥 UI 2.0 — 개편 전 감사 (Step 0)

작성: 2026-10-30 · 브랜치 `ui-2.0` (운영 자동배포 `main`과 분리) · 기준 시안 `ssook_2.0/reference/original-first-concept.png`

## 1. 기술 스택·실행 환경

| 항목 | 내용 |
|---|---|
| 프레임워크 | Next.js 16.2.9 (App Router), React 19.2, TypeScript 5 |
| 스타일 | Tailwind CSS 3.4 + `app/globals.css` 커스텀 클래스(`.card`, `.chip`, `.btn-pop`, 의료 전용 `.med-*`) |
| 의존성 | `fast-xml-parser` 1개뿐. UI 라이브러리·아이콘 패키지 없음 |
| 상태 | 서버 상태 없음. 전부 브라우저 `localStorage`/`sessionStorage` |
| 배포 | GitHub `cslis07/ssook-portal` `main` push = Vercel 운영 자동배포 → **이번 작업은 `ui-2.0` 브랜치에서만** |
| 로컬 실행 | 기존 문서엔 "로컬 dev 불가"였으나 원인은 Turbopack 한정. **`npx next dev --webpack` 으로 정상 구동 확인(HTTP 200)** → 로컬 프리뷰·스크린샷 가능 |

## 2. 라우트 ↔ 파일 매핑 (기존 12기능 + 보조)

| URL | 파일 | 핵심 기능(보존 대상) |
|---|---|---|
| `/` | `app/page.tsx` → `HomeMenu`, `AdSlot`×2, `TodayPick` | 12개 메뉴 그리드, 쿠팡 광고(고지 포함), 서울 공공서비스 랜덤 픽 |
| `/support` | `app/support/page.tsx` | 지원금 12종(`SUPPORTS`) 카테고리 표시 |
| `/calculator` | `app/calculator/page.tsx` | 출생순위·다태아·지역·양육형태·기간·난방 → `useMemo` 합산, 아기정보 프리필, 공유 |
| `/timeline` | `app/timeline/page.tsx` + `TimelineChecklist` | 5단계 23개 체크, 진행률, `ssook-timeline-check` 저장 |
| `/localgov` | `app/localgov/page.tsx` + `lib/localgov-data.ts` | 서울 자치구 실금액, 전국 검색 링크 |
| `/utility` | `app/utility/page.tsx` | 공과금 감면 6종(`UTILITY`) |
| `/calendar` | `app/calendar/page.tsx` + `MonthCards` | 접종·검진 접이식, 아기 개월만 표시/전체보기 |
| `/growth` | `app/growth/page.tsx` + `lib/growth.ts` | 이른둥이~36개월 8구간 탭 |
| `/checklist` | `app/checklist/page.tsx` | 필수/출산가방 체크·진행률, 꿀팁, `ssook-checklist-v1` 저장 |
| `/local` | `app/local/page.tsx` | 시도→시군구 선택(`ssook-region-v2`), 예방접종기관·교통사고·대공원 |
| `/seoul` | `app/seoul/page.tsx` | 서울 공공예약 카테고리·자치구·상태·키워드 필터 |
| `/medical` | `app/medical/page.tsx` (623줄, `.med-*` 전용 스타일) | 응급실·병의원·약국·심야약국·약 검색, GPS, `?tab=` |
| `/fever` | `app/fever/page.tsx` | 체중별 용량(아세트 10~15mg/kg, 이부 5~10mg/kg) · 질병 아코디언 |
| `/privacy` | `app/privacy/page.tsx` | 개인정보·면책 |
| `/guide.html` | `public/guide.html` (정적) | 이용가이드 |
| 공통 | `app/layout.tsx`, `components/NavBar.tsx`, `components/BabyButton.tsx` | 헤더·드롭다운, 아기정보 모달, 스플래시, SW 등록, 정부 비제휴 면책·공식 출처 푸터 |

API 라우트 10개(`app/api/*`)·`/.well-known/assetlinks.json`은 **UI 개편 대상 아님 — 무수정**.

## 3. 저장소(localStorage/sessionStorage) — 키 이름 절대 변경 금지

| 키 | 위치 | 내용 |
|---|---|---|
| `ssook-baby-v1` (+이벤트 `ssook-baby-change`) | `lib/baby.ts` | 아기 프로필(애칭·출생/예정일·순위·지역·다태아) — **기기에만 저장** |
| `ssook-checklist-v1` | `app/checklist` | 준비물·출산가방 체크 |
| `ssook-timeline-check` | `TimelineChecklist` | 신청 할 일 체크 |
| `ssook-region-v2` | `app/local` | 우리 동네 지역 |
| `ssook-med-region` | `app/medical` | 의료 지역 |
| `ssook-baby-prompted` (session) | `BabyButton` | 아기정보 자동팝업 1회 플래그 |
| `ssook-splash` (session) | `layout` 인라인 | 스플래시 1회 플래그 |

## 4. 메인 시안 데이터 → 실데이터 매핑 (더미 하드코딩 금지)

| 시안 요소 | 시안 더미 | 실제 소스 (기존 데이터·로직만 사용) | 데이터 없을 때 |
|---|---|---|---|
| 프로필 칩 `우리 아이 · 29개월` | 고정값 | `useBaby()` 애칭 + `ageMonths()` / 출산예정이면 `D-n` | `아기 정보 입력하기` (팝업 강제 없음) |
| 놓치지 마세요 `첫만남이용권 D-5 2026.1.31` | 가짜 마감 | **`lib/schedule.ts` `upcomingEvents()`** — 출생일 기준 접종·검진 권장일 D-day. *이미 구현돼 있으나 어떤 화면에도 연결 안 된 함수* | 출산 예정: `TIMELINE` '출생 직후 60일 이내' 단계 / 미입력: `MISS_TOP7` 정적 안내 |
| 예상 지원금 `3,420,000원` | 가짜 금액 | 계산기 합산식(현재 `calculator/page.tsx` 내부 `useMemo`) — 프로필의 순위·지역·다태아 + 계산기 기본값(가정양육·24개월·도시가스) | `조건을 입력하면 확인할 수 있어요` + 계산기 이동 |
| `신청할 수 있는 혜택 3건` | 가짜 건수 | `SUPPORTS.length`(12종) 안내로 대체 | — |
| 월령별 성장 가이드 `25–36개월` 3줄 | 예시 문구 | `lib/growth.ts` 해당 구간 `development`(언어·사회·운동) 첫 문장 | 월령 입력 안내 + `/growth` |
| 우리 동네 프로그램 `서울시 강남구 공동육아나눔터` | 가짜 장소·사진 | `/api/seoul-reserve` 실데이터(서울 공공예약, 영유아 대상 접수중 우선, 실제 `IMGURL`) | 빈 상태 + `/seoul` |
| 헤더 `김서연님` + 엄마 사진 | 가짜 인물 | 부모 정보 없음 → 아기 애칭 또는 `아기 정보` / 사진 없이 비식별 일러스트 아바타 | — |

## 5. 시안 대비 기능 공백 — 승인 필요 결정 사항

| 항목 | 현황 | Phase 1 임시 처리 | 비고 |
|---|---|---|---|
| 헤더 🔍 검색 | **검색 기능 없음** | 아이콘 유지, 누르면 **전체 메뉴 패널** 열기 | 실제 검색은 P1 별도 승인 |
| 헤더 🔔 알림 | **알림 기능 없음** | 아이콘 유지, `/timeline`(신청 할 일)로 연결 | 알림은 별도 승인 |
| 모바일 탭 `내 정보` | 해당 페이지 없음 | 하단 시트: 아기 정보 + 전체 메뉴(12개·가이드·개인정보) | 생활·의료 2탭 내 접근 보장 |
| 아기정보 **자동 팝업**(세션당 1회) | 현재 동작 | 명세 5.3("강제 모달 금지")에 따라 **끔** → 히어로 칩·CTA로 부드럽게 유도 | 기존 동작 변경 → 승인 시 확정 |
| 계산 로직 홈 표시 | 계산식이 페이지 내부 | `lib/calc.ts`로 **로직 그대로 추출**(수식 무변경) → 계산기·홈 공유. 추출 전후 금액 동일성 테스트 | 수식 변경 없음 |

## 6. 이미지 에셋 계획 (원본 통째 배경 금지 원칙 준수)

제공물은 레이어가 합쳐진 **1672×941 단일 PNG**(데스크톱 영역 ≈1235px = 1440px의 0.86배). 따라서:

- **히어로 아트**(아이·해 인형·유리블록·새싹·집): 원본에서 오른쪽 아트 영역만 잘라 독립 이미지로 사용. 왼쪽 제목·칩·CTA는 실제 DOM. **아트 안의 손글씨·보조 문구는 이미지에서 지우고(배경 보정) DOM 텍스트로 재구성**(QA A항 "이미지에 텍스트 굽지 않음").
- **3D 아이콘**(퀵링크 4종, 카드 아이콘·장식): 원본에서 개별 크롭. 
- **동네 카드 사진**: 시안 사진은 가짜 장소라 **사용 안 함** → 실제 API 이미지, 없으면 플레이스홀더.
- **아바타**: 시안 인물 사진 사용 안 함 → 비식별 일러스트.
- ⚠️ **해상도 한계**: 크롭 원본이 0.86배라 1x 화면은 무난하나 레티나(2x)에선 약간 흐림 → **고해상도 히어로 원본(분리 레이어) 제공 시 교체 권장**(최종 보고의 asset gaps).

## 7. 폰트 — 사용자 상시 정책과 충돌 정리

명세는 `Pretendard Variable` 웹폰트를 권장하나, 사용자 상시 정책 **"한글은 기기 기본 폰트, 웹폰트 금지"**(2026-10-01 이용가이드에서 Noto 다운로드 제거)가 우선. → 폰트 스택에 `Pretendard`를 **이름만** 넣고(기기에 설치된 경우만 사용) CDN 로딩 없음, 기본은 `Apple SD Gothic Neo`/`Malgun Gothic`.

## 8. 기존 버그(개편 중 함께 수정)

- **하이드레이션 불일치 경고**: `layout.tsx` 스플래시 인라인 스크립트가 React 하이드레이션 전에 `#splash` class를 바꿈 → dev 오버레이 "1 Issue". `suppressHydrationWarning`로 해결 예정(동작 무변경).

## 9. 기능 회귀 테스트 목록 (각 단계 후 실행)

- `/calculator`: 조건 6종 변경 → 합계·항목별 금액, 프로필 프리필, 공유 버튼 (**`lib/calc.ts` 추출 전후 동일 입력 = 동일 출력**)
- `/timeline`: 23개 체크·해제·진행률·새로고침 후 유지
- `/checklist`: 필수·출산가방 체크·두 진행률·새로고침 유지
- `/calendar`: 접종·검진 접이식, 개월만/전체보기
- `/growth`: 8개 탭 전환
- `/localgov`, `/utility`, `/support`: 목록·링크
- `/local`: 지역 선택 저장·조회 / `/seoul`: 필터·키워드·예약 링크 / `/medical`: 탭·조회·`?tab=` 딥링크
- `/fever`: 체중 ±·슬라이더 → mL/mg 수치 (**계산식 무수정 확인**)
- 공통: 아기정보 저장/수정/삭제, 정부 비제휴 면책·공식 출처 링크, 쿠팡 광고 고지, `/privacy`·`/guide.html` 링크

## 10. 진행 순서

1. (이 문서) 감사 ✅
2. Phase 1: 토큰·헤더·모바일 하단탭·홈 PC/모바일 구현 → 1440×900 / 390×844 스크린샷을 원본과 나란히 비교 → **사용자 1차 승인**
3. Phase 2: 승인 후 12개 메뉴 일괄 적용
4. Phase 3: QA_CHECKLIST 전항목 검증
5. 배포는 **사용자 명시 승인 후에만** (그 전엔 `ui-2.0` 브랜치·로컬 프리뷰만)

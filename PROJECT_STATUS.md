# 쑥쑥 포털 — PROJECT STATUS

> 최종 업데이트: 2026-07-07
> 배포: https://ssook-portal.vercel.app · GitHub: cslis07/ssook-portal

---

## 1. 프로젝트 목적

**2026 대한민국 출산·육아 올인원 웹포털.** 예비/신생아 부모(엄마·아빠)를 주 사용자로,
정부·지자체 지원금, 출산 준비물, 개월별 발달 가이드, 우리 동네 어린이집·의료 정보,
약 안전·해열제 용량까지 **흩어진 출산·육아 정보를 한 곳에서** 제공한다.

- 톤: 파스텔 로즈 기반 귀엽고 다정한 디자인
- 방향: 단순 정보 나열 → **"내 아기에 맞춘 개인화 + 놓치지 않게"** 하는 육아 파트너
- 수익화(보류): 쿠팡 파트너스 제휴, 지역 스폰서 픽, 보험/조리원 리드 (트래픽 확보 후)

---

## 2. 현재 구현된 기능

### 홈 (`/`)
- **아기 프로필 개인화** — 생년월일/출산예정일·출생순위·지역·다태아 1회 입력(localStorage)
  → 홈에 "생후 N개월 D+82" + 다가오는 접종·검진 D-day 표시
- 컴팩트 히어로(버튼 3개) + **바로가기 그리드 8개** + **오늘의 공공서비스 픽**(카테고리별 랜덤 추천)

### 지원금·신청
- `/timeline` — 신청 타임라인 + **체크박스 진행률 저장**
- `/support` — 지원금 12종 카테고리별 정리
- `/localgov` — **지자체 출산지원금 찾기**(지역선택→공식공고·검색 원클릭 + 2026 대표사례)
- `/calculator` — 예상 수령액 계산기(**아기 프로필 자동 프리필** + 공유 버튼)
- `/utility` — 공과금(전기·가스·난방·에너지바우처) 감면

### 아기 키우기
- `/calendar` — 0~24개월 가이드(**현재 개월수 카드 자동 강조·스크롤**) + 예방접종·검진 일정
- `/growth` — 이른둥이~36개월 월령별 성장(아이사랑 데이터)
- `/checklist` — 준비물 체크리스트(localStorage 저장 + 진행률)

### 생활·의료
- `/local` — 우리 동네(어린이집·예방접종 기관·교통사고 다발지역·대공원), 전국 시도→시군구
- `/medical` — 응급실(실시간 병상·GPS·외상·중증)·병의원·달빛어린이병원·약국·AED·심야약국·선별진료소 + **💊 약 안전 검색(식약처 e약은요)**
- `/fever` — **해열제 몸무게별 용량 가이드**(아세트아미노펜·이부프로펜)
- `/seoul` — 서울 공공서비스 예약(카테고리·대상·무료유료·상태 필터 + 정렬)

### 공통 인프라
- **PWA** — 홈 화면 설치 + 오프라인 캐시(manifest·service worker·앱아이콘)
- **SEO** — sitemap·robots·OG/트위터 메타·동적 OG이미지, 계산기 결과 공유 버튼
- **페이지네이션** — 20건/페이지(병의원·약국·예방접종·약검색 서버 페이징, 나머지 클라이언트 분할)
- `/guide.html` — 이용가이드(정적, 사이드바 TOC + 모바일 드로어)

---

## 3. 수정한 주요 파일

```
app/
  layout.tsx              메타/OG/뷰포트(themeColor) + ServiceWorker 등록
  page.tsx                홈(BabyProfile + 바로가기 + TodayPick)
  sitemap.ts robots.ts    SEO
  opengraph-image.tsx     동적 OG 이미지(1200x630)
  manifest.ts             PWA manifest
  calculator/page.tsx     계산기(프로필 프리필 + 공유버튼)
  calendar/page.tsx       개월별(현재개월 강조, data-lo/hi 앵커)
  timeline/page.tsx       타임라인(체크리스트 위임)
  fever/page.tsx          해열제 용량 계산
  localgov/page.tsx       지자체 지원금 찾기
  medical/page.tsx        의료/약국 + 약 안전 탭(?tab= 딥링크)
  local/page.tsx seoul/page.tsx  우리동네 / 서울예약
  api/
    medical  seoul-reserve  daycare  clinic  accident      기존 프록시
    drug/route.ts          식약처 e약은요 약 검색
    aed  night-pharmacy  screening-clinic
    appicon/route.tsx      PWA 아이콘(ImageResponse)
components/
  NavBar.tsx              3그룹 드롭다운 + 모바일 햄버거
  BabyProfile.tsx         아기 프로필 입력/요약 카드
  TodayPick.tsx           오늘의 공공서비스 픽(카테고리별 다중)
  TimelineChecklist.tsx   신청 진행 체크
  CalendarPersonalize.tsx 개월별 현재 시기 강조
  Pager.tsx               공용 페이지네이션
  ServiceWorker.tsx       SW 등록
lib/
  data.ts                 지원금·타임라인·개월·준비물·공과금 정적 데이터
  baby.ts                 아기 프로필 훅 + 나이/D-day 계산
  schedule.ts             예방접종·영유아검진 일정
  childcare-regions.ts    전국 228개 시군구 arcode 맵(자동생성)
  regions.ts              17개 시도→시군구(의료 API용) + 중증질환 코드
  local-data.ts  api-helper.ts
public/
  guide.html              이용가이드
  sw.js                   서비스워커
```

---

## 4. 남은 작업

| 우선순위 | 작업 | 비고 |
|---|---|---|
| 검색노출 | 네이버 서치어드바이저·구글 서치콘솔 등록 | 소유확인 메타태그 삽입 → sitemap 제출 |
| 홍보 | 맘카페·네이버 블로그 SEO, 스레드/인스타 카드뉴스 | threads-scheduler 연계 가능 |
| 데이터 | 지자체 출산지원금 **실제 금액 DB**(주요 도시부터 수동 큐레이션) | 구조화 API 없음 → 크롤러/수동 |
| 수익화 | 쿠팡 파트너스(준비물·육아템), 지역 스폰서 픽 | 표시광고법 문구·개인정보처리방침 필요 |
| 기능 | 지역별 SEO 랜딩("○○구 출산지원금"), 즐겨찾기, 전역검색 | |
| 데이터 | 놀이터(지역필터 불가)·안전식품(키 사망) 대체 소스 | safemap.go.kr 등 |

---

## 5. 실행 명령어

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 (⚠️ 이 Windows 머신에서 Turbopack 크래시 — 아래 주의 참고)
npm run build        # 프로덕션 빌드
npm run start        # 빌드 결과 실행

# 정적 파일(guide.html 등)만 미리보기: public 디렉터리에서
py -m http.server 8891   # → http://localhost:8891/guide.html

# 배포 (커밋 → push → Vercel 자동배포, 또는 CLI)
git add -A
git -c user.email=cslis07@gmail.com -c user.name=cslis07 commit -m "..."
git push origin main        # push 계정 cslis07
vercel --prod --yes         # 수동 프로덕션 배포
vercel ls ssook-portal      # 배포 상태 확인
vercel env ls               # 환경변수 확인
```

---

## 6. 배포 관련 주의사항

- **로컬 `npm run dev` 불가**: 이 Windows 머신에서 Next 16 Turbopack의 postcss 서브프로세스가
  `0xc0000142`(DLL 초기화 실패)로 죽는다. 코드 검증은 **Vercel 리눅스 빌드에서** 한다.
  (순수 정적 파일만 `py -m http.server`로 확인)
- **커밋 계정**: `git -c user.email=cslis07@gmail.com -c user.name=cslis07 commit`
- **push 계정**: cslis07 (403 발생 시 gh auth switch)
- **환경변수(Vercel Production·Development·Preview)**:
  - `DATA_API_KEY` — data.go.kr(의료·AED·심야약국·예방접종·교통사고·약검색)
  - `SEOUL_API_KEY` / `SEOUL_REALTIME_KEY` — 서울 열린데이터광장
  - `CHILDCARE_API_KEY` — 아이사랑 어린이집(cpmsapi021)
  - 키 없으면 각 API가 **샘플 데이터 + 안내문구로 graceful fallback**
- **CRLF 경고**: 커밋 시 LF→CRLF 경고는 무시해도 됨(Windows 로컬 개행)
- 성능: 서울 API는 30분 캐시 + 필드 슬림(6.5MB→0.7MB), 정적성 API는 s-maxage CDN 캐시.
  **응급실(실시간 병상)은 캐시 제외**(신선도).

---

## 7. 최근 발생한 에러와 해결 방법

| 증상 | 원인 | 해결 |
|---|---|---|
| Vercel 빌드 `Vulnerable version of Next.js` | Next 15.0.3 보안 차단 | Next 16.x로 업그레이드 |
| `npm run dev` 500 / TurbopackInternalError `0xc0000142` | Windows Turbopack postcss 서브프로세스 크래시(환경) | 로컬 dev 포기, Vercel 빌드로 검증 |
| 계산기 `onClick={searchRegion}` 타입 에러 | 이벤트 객체가 page 인자로 들어감 | `onClick={() => searchRegion(1)}` 래핑 |
| 어린이집 조회 안 됨 | data.go.kr 엔드포인트/키로 호출 | childcare.go.kr **cpmsapi021 + HTTPS + arcode + CHILDCARE_API_KEY**로 교체 |
| 어린이집 arcode 불일치(제주·광주·전남·통합시) | childcare 코드가 법정동과 다름(제주=49, 광주+전남=prefix12 통합) | API 주소 전수 스캔으로 코드맵 자동생성(`lib/childcare-regions.ts`, 228개) |
| 예방접종·교통사고 결과 없음 | 잘못된 엔드포인트 + TAAS WAF 차단 | orglist3 / schoolzoneChild(+User-Agent 헤더)로 교체 |
| 홈 오늘의픽 7.6초 로딩 | 서울 API 무캐시 + 6.5MB 응답 | 30분 캐시 + 필드 슬림(0.7MB) → 0.2~0.5초 |
| 서울예약 필드 깨짐 | HTML 엔티티(&#39; 등) | decodeHtml 처리 |

---

## 8. API 구조

모든 외부 API는 **Next 라우트 프록시**(`app/api/*`)를 경유한다.
→ CORS 회피 + 서비스키 서버 은닉 + 응답 정규화 + 캐싱 + 샘플 fallback.

| 라우트 | 외부 API | 키 | 파라미터 | 캐시 |
|---|---|---|---|---|
| `/api/medical` | 국립중앙의료원 B552657 (응급실·병의원·약국) | DATA_API_KEY | service·op·Q0/Q1·STAGE1/2·pageNo | 없음(응급실 신선도) |
| `/api/daycare` | childcare.go.kr **cpmsapi021** (HTTPS·XML) | CHILDCARE_API_KEY | arcode(5자리) | s-maxage 1h |
| `/api/clinic` | data.go.kr 1790387/orglist3 (예방접종 위탁기관) | DATA_API_KEY | brtcCd(앞2)·sggCd(arcode)·page | s-maxage 1h |
| `/api/accident` | TAAS B552061/schoolzoneChild (**User-Agent 필수**) | DATA_API_KEY | siDo(앞2)·guGun(뒤3)·searchYearCd | s-maxage 1d |
| `/api/drug` | 식약처 1471000/DrbEasyDrugInfoService (e약은요) | DATA_API_KEY | itemName·pageNo | s-maxage 1h |
| `/api/seoul-reserve` | 서울 openapi.seoul.go.kr (공공서비스예약) | SEOUL_API_KEY | cat·start·end / detail | 30분 + 필드슬림 |
| `/api/aed` `/api/night-pharmacy` | 국립중앙의료원 (AED·약국) | DATA_API_KEY | sido·sigungu | — |
| `/api/screening-clinic` | 정적 안내 | — | — | — |
| `/api/appicon` | (내부) ImageResponse PWA 아이콘 | — | size | — |

### 지역 코드 체계 주의
- **의료 API(B552657)**: 시도/시군구 **이름**(Q0/Q1, STAGE1/2) 사용 → `lib/regions.ts`
- **어린이집(cpmsapi021)**: childcare 자체 **arcode**(법정동과 다름) → `lib/childcare-regions.ts`
  - 제주=prefix49, 광주+전남=prefix12 통합("전남광주통합특별시" 라벨), 통합시는 구단위
- **예방접종/교통사고**: arcode를 분해(앞2=시도, 뒤3=시군구) → 표준코드와 다른 지역(제주·광주·전남·통합시)은 빈 결과 가능(graceful)

### 지자체 출산지원금
- **구조화 API 없음.** 아이사랑 menuno=279는 게시판 + PDF 첨부.
- `/localgov`는 지역선택 → 아이사랑 공고·네이버·구글·정부24 **검색 링크** + 2026 대표사례 큐레이션.

### 개인화 (API 아님, localStorage)
- `lib/baby.ts` — `ssook-baby-v1` 키, `useBaby()` 훅(커스텀 이벤트로 컴포넌트 동기화), 생일→개월수/D-day
- `lib/schedule.ts` — 접종·검진 표준일정(출생일 offset) → 다가오는 이벤트 D-day
```

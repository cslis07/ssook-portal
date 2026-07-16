# 아이쑥쑥 — PROJECT STATUS

- **최종 업데이트**: 2026-07-07
- **프로젝트 절대경로**: `C:\Users\GB\Documents\mcp\ssook-portal`
- **GitHub**: `cslis07/ssook-portal` · 기본 브랜치 `main`
- **배포**: https://ssook-portal.vercel.app · **Vercel** (git push 시 자동배포)
- **규모**: 페이지 라우트 14 · API 라우트 10(+`.well-known/assetlinks.json` 1) · 컴포넌트 9 · lib 8
- **앱(안드로이드)**: TWA 패키지 생성 완료. Package ID `app.vercel.ssook_portal.twa`, 앱 표시명 **아이 쑥쑥**

> 브랜드명은 **아이쑥쑥**(구 "쑥쑥 포털"에서 리브랜딩). 도메인·저장소·패키지 문자열의 `ssook`/`ssook-portal`은 그대로 유지(변경 불가/불필요).

---

## 0. 지금 하던 일 (WIP)

**깨끗한 상태.** `git status` 미커밋 변경 없음. 최신 커밋 `cade2f2`(전체메뉴 라벨 변경)까지 push·배포 완료.

- **다음 채팅이 가장 먼저 할 것**: 없음(대기). 이어서 진행할 후보는 §4 참고 — 우선순위는 "네이버·구글 서치콘솔 등록"(사용자가 소유확인 태그 2개만 주면 5분).

---

## 1. 프로젝트 목적

**2026 대한민국 출산·육아 올인원 웹/모바일 앱.** 예비·신생아 부모 대상, 정부·지자체 지원금 + 출산 준비물 + 개월별 발달 + 우리 동네 의료 + 약/해열제 안전을 한 곳에.

- 방향: 정보 나열 → **"내 아기 맞춤 개인화 + 놓치지 않게"**. 아기 정보 1회 입력 → 개월수·D-day·계산기 자동 맞춤.
- 최근 세션: **아이쑥쑥 리브랜딩** → **홈 KidsNote식 아이콘 그리드 개편** → **광고(쿠팡 파트너스) 도입** → **안드로이드 TWA 패키징**.

---

## 2. 현재 구현된 기능 (라우트)

### 홈 `/`
- **전체 메뉴**(아이콘 그리드 12개, `HomeMenu`) — 최상단 허브
- **광고 슬롯**(`AdSlot`, 쿠팡 파트너스) 2곳 + **오늘의 공공서비스 픽**(`TodayPick`, 카테고리별 랜덤)
- 히어로·아기프로필 카드는 **제거됨**. 아기 정보는 상단바 버튼(`BabyButton`)으로 이동.

### 상단바 (`NavBar`)
- 좌: 로고 + **아기 정보 버튼**(미입력 시 "아기 정보 입력하기" + **자동 팝업 세션당 1회**, 입력 시 이름·개월수 표시)
- 우: 데스크톱 3그룹 드롭다운 + **📖 이용가이드 버튼(항상 노출)** + 모바일 햄버거

### 지원금·신청
- `/timeline` 신청 타임라인(체크박스 진행률 저장) · `/support` 지원금 12종
- `/localgov` 지자체 지원금(**서울 실제금액 구조화** + 전 지역 검색링크·대표사례)
- `/calculator` 계산기(아기 프로필 프리필 + 공유버튼) · `/utility` 공과금 감면

### 아기 키우기
- `/calendar` 0~24개월(현재 개월 자동 강조·스크롤) · `/growth` 이른둥이~36개월 · `/checklist` 준비물(저장+진행률)

### 생활·의료
- `/local` 우리 동네(어린이집·예방접종기관·교통사고 다발지역·대공원)
- `/medical` 응급실(실시간병상·GPS·외상·중증)·병의원·**야간·휴일 소아진료**·약국·심야약국·선별진료소 + **💊 약 안전 검색**(식약처 e약은요) — `?tab=` 딥링크
- `/fever` 해열제 몸무게별 용량 · `/seoul` 서울 공공서비스 예약(필터·정렬)

### 기타
- `/privacy` 개인정보 처리방침·면책 · `/guide.html`(정적) 이용가이드
- PWA(설치·오프라인) · SEO(sitemap·robots·OG·동적OG) · 페이지네이션 20건/페이지

---

## 3. 수정한 주요 파일 (경로 | 역할, 🆕=이번 세션 신규)

| 경로 | 역할 |
|---|---|
| `app/page.tsx` | 홈(HomeMenu+AdSlot+TodayPick) — 🆕 히어로/프로필 제거 개편 |
| `app/layout.tsx` | 메타·OG·themeColor·SW등록·푸터(privacy 링크) |
| `app/manifest.ts` | PWA/TWA manifest(아이쑥쑥·shortcuts·screenshots) |
| `app/.well-known/assetlinks.json/route.ts` | 🆕 TWA 도메인검증(env 주입) |
| `app/api/screenshot/route.tsx` | 🆕 manifest 스크린샷 프로모 이미지(edge) |
| `app/api/appicon/route.tsx` `app/icon.tsx` `app/apple-icon.tsx` | 앱/파비콘/iOS 아이콘(ImageResponse) |
| `app/opengraph-image.tsx` | 동적 OG(1200×630, edge) |
| `app/error.tsx` `app/not-found.tsx` `app/loading.tsx` | 에러/404/로딩 |
| `app/localgov/page.tsx` | 지자체 지원금(서울 구조화 + 검색) |
| `app/medical/page.tsx` | 의료/약국 — 🆕 AED탭 제거·달빛 라벨변경·약검색 로딩스피너 |
| `app/privacy/page.tsx` | 개인정보·면책 |
| `components/HomeMenu.tsx` | 🆕 아이콘 그리드 메뉴 |
| `components/AdSlot.tsx` | 🆕 광고(쿠팡 파트너스, 표시광고법 고지) |
| `components/BabyButton.tsx` | 🆕 상단바 아기정보 버튼+입력 모달(자동팝업) |
| `components/NavBar.tsx` | 🆕 BabyButton·이용가이드 버튼 통합 |
| `components/CalendarPersonalize.tsx` `TimelineChecklist.tsx` `Pager.tsx` `ServiceWorker.tsx` `TodayPick.tsx` | 개인화/체크/페이저/SW/오늘의픽 |
| `lib/baby.ts` | 아기 프로필 훅 + 나이/D-day |
| `lib/schedule.ts` | 접종·검진 표준일정 D-day |
| `lib/localgov-data.ts` | 🆕 서울 지자체 실제금액 |
| `lib/childcare-regions.ts` | 전국 228개 시군구 arcode(자동생성, 손대지 말 것) |
| `lib/regions.ts` `data.ts` `growth.ts` `local-data.ts` | 정적 데이터 |
| `ANDROID.md` | 🆕 TWA 빌드/출시 가이드 |
| `COMPLETENESS.md` | 완성도 루브릭 |

> ⚠️ 구 문서에 있던 `components/BabyProfile.tsx`, `lib/api-helper.ts`, `app/api/aed`·`playground`·`snack`은 **이번/직전 세션에 삭제됨**(아래 §10 참고).

---

## 4. 남은 작업 (우선순위 · 왜 아직 안 했는지)

**A. 곧 (저비용·고효과)**
- 네이버 서치어드바이저·구글 서치콘솔 등록 — *사용자의 소유확인 메타태그 2개가 있어야 삽입 가능(대기 중)*
- 쿠팡 파트너스 실제 추적링크 연결 — *사용자 파트너스 가입·승인·링크 필요(env `NEXT_PUBLIC_COUPANG_URL`)*

**B. 콘텐츠**
- 지자체 실제 금액 DB를 **서울 외 광역시로 확장** — *공개 구조화 API가 없어 수동 큐레이션 필요(§10)*

**C. 홍보/기능**
- 맘카페·블로그·스레드 배포 / 지역별 SEO 랜딩 / 즐겨찾기 / 전역검색 — *트래픽·리소스 우선순위상 뒤로*

**D. 앱**
- Play Console 업로드·심사 — *사용자의 개발자 계정($25)·스크린샷 필요*

---

## 5. 실행 명령어 (커밋 전 검증 절차 포함)

```bash
npm install

# ⚠️ 로컬 dev 불가(아래 §6): npm run dev 가 이 PC에서 Turbopack 크래시.
#    → 코드 검증은 Vercel 빌드로만. 정적 파일만 로컬 미리보기:
py -m http.server 8891   # public/ 에서 → http://localhost:8891/guide.html

# --- 커밋 전 검증 (권장 절차) ---
# 1) 논리/타입 오류는 로컬 빌드가 죽어 못 잡음 → 작은 단위로 커밋해 Vercel 빌드 로그로 확인
# 2) 삭제한 심볼의 잔존 참조 grep:
grep -rn "삭제한이름" app components lib

# --- 배포 ---
git add -A
git -c user.email=cslis07@gmail.com -c user.name=cslis07 commit -m "..."
git push origin main                # 계정 cslis07
vercel --prod --yes                 # 수동 프로덕션(자동배포도 되지만 즉시확인용)
until vercel ls ssook-portal | grep -qE "Ready.*Production"; do sleep 5; done
vercel ls ssook-portal              # 상태
vercel env ls                       # 환경변수
```

---

## 6. 배포 관련 주의사항

- **로컬 `npm run dev` 불가**: Next 16 Turbopack의 postcss 서브프로세스가 이 Windows 머신에서 `0xc0000142`(DLL 초기화 실패)로 죽음. **검증은 Vercel 리눅스 빌드에서.**
- **커밋 계정 고정**: `git -c user.email=cslis07@gmail.com -c user.name=cslis07 commit`
- **push 계정**: cslis07 (403 시 `gh auth switch`)
- **런타임 제약**: `opengraph-image`·`api/appicon`·`api/screenshot` = **edge runtime**(`export const runtime="edge"`). `.well-known/assetlinks.json` = `force-static`.
- **CRLF 경고**: 커밋 시 LF→CRLF 경고는 무시(윈도우 개행).
- **성능**: 서울 API 30분 캐시+필드슬림(6.5MB→0.7MB), 정적성 API는 s-maxage CDN 캐시. **응급실(실시간 병상)은 캐시 제외.**

### 환경변수 (Vercel — Production·Development 설정 확인됨 / Preview는 일부 미설정 가능)

| 키 | 용도 | 없을 때 |
|---|---|---|
| `DATA_API_KEY` | data.go.kr — 의료·심야약국·예방접종·교통사고·약검색 | 각 API 샘플 fallback |
| `SEOUL_API_KEY` | 서울 열린데이터 — 공공서비스예약 | 오류 반환 |
| `SEOUL_REALTIME_KEY` | 서울 실시간(확장 대비) | 현재 직접 미사용 |
| `CHILDCARE_API_KEY` | 아이사랑 어린이집(cpmsapi021) | 샘플 fallback |
| `TWA_PACKAGE` | TWA 도메인검증 package_name (`app.vercel.ssook_portal.twa`) | assetlinks `[]` 반환 |
| `TWA_SHA256` | TWA 서명 SHA-256 지문 | assetlinks `[]` 반환 |
| `NEXT_PUBLIC_COUPANG_URL`(선택) | 광고 쿠팡 파트너스 추적링크 | 쿠팡 육아 카테고리 기본 |

---

## 7. 최근 발생한 에러와 해결

| 증상 | 원인 | 해결 |
|---|---|---|
| Vercel 빌드 `Vulnerable version of Next.js` | Next 15.0.3 보안 차단 | Next 16.x 업그레이드 |
| `npm run dev` 500 / `0xc0000142` | Windows Turbopack postcss 크래시(환경) | 로컬 dev 포기, Vercel 빌드 검증 |
| 계산기/의료 `onClick={fn}` 타입에러 | 이벤트가 함수 인자로 들어감 | `onClick={() => fn(1)}` 래핑 |
| 어린이집 조회 안 됨 | data.go.kr 엔드포인트/키 오용 | childcare.go.kr **cpmsapi021+HTTPS+arcode+CHILDCARE_API_KEY** |
| 어린이집 arcode 불일치 | childcare 코드≠법정동(제주49·광주+전남 prefix12) | API 주소 전수스캔 코드맵 자동생성(`childcare-regions.ts` 228개) |
| 예방접종·교통사고 빈결과 | 잘못된 엔드포인트 + TAAS WAF 차단 | orglist3 / schoolzoneChild(+User-Agent 헤더) |
| 홈 오늘의픽 7.6초 | 서울 API 무캐시 + 6.5MB | 30분 캐시 + 필드슬림 → 0.2~0.5초 |
| 서울예약 텍스트 깨짐 | HTML 엔티티(&#39;) | decodeHtml |
| **AED "비정상"** | DATA_API_KEY가 **AED 서비스 미승인(Forbidden)** | **AED 탭·API 제거**(§10) |
| **약검색 느낌** | 새 검색어마다 상위 API 1.7초(캐시 후 0.1초) | 로딩 스피너 추가(체감 개선) |

---

## 8. API 구조

내부 라우트는 모두 **Next 프록시**(`app/api/*`) — CORS 회피·서비스키 은닉·정규화·캐싱·샘플 fallback.

| 라우트 | 외부 API | 키 | 특이사항 |
|---|---|---|---|
| `/api/medical` | 국립중앙의료원 B552657 | DATA_API_KEY | **이름**(Q0/Q1·STAGE1/2)으로 조회. 응급실 캐시 제외 |
| `/api/daycare` | childcare.go.kr **cpmsapi021**(HTTPS·**XML**) | CHILDCARE_API_KEY | **지역당 50건 하드캡**(numOfRows·pageNo 무시). arcode 별도체계 |
| `/api/clinic` | data.go.kr 1790387/orglist3 | DATA_API_KEY | brtcCd(앞2)+sggCd(arcode). 페이지네이션 |
| `/api/accident` | TAAS B552061/schoolzoneChild | DATA_API_KEY | **User-Agent 헤더 필수**(없으면 WAF 400) |
| `/api/drug` | 식약처 1471000/DrbEasyDrugInfoService(e약은요) | DATA_API_KEY | 상위 API ~1.7초. s-maxage 1h |
| `/api/seoul-reserve` | 서울 openapi.seoul.go.kr | SEOUL_API_KEY | 느림→30분 캐시+필드슬림. HTML엔티티 디코드 필요 |
| `/api/night-pharmacy` | 국립중앙의료원(약국) | DATA_API_KEY | 요일 자동감지 심야 필터 |
| `/api/screening-clinic` | (정적 안내) | — | — |
| `/api/appicon` `/api/screenshot` | ImageResponse(내부, edge) | — | 아이콘/스크린샷 생성 |
| `/.well-known/assetlinks.json` | (내부, force-static) | TWA_PACKAGE·TWA_SHA256 | TWA 도메인검증 |

**지역 코드 체계**(함정): 의료=이름 / 어린이집=childcare arcode(제주 prefix49, 광주+전남 prefix12 통합, 통합시는 구단위) / 예방접종·교통사고=arcode를 앞2·뒤3으로 분해(표준코드와 다른 지역은 빈결과 graceful).

**개인화**(API 아님, localStorage): `lib/baby.ts`(`ssook-baby-v1` 키, `useBaby` 훅+커스텀이벤트 동기화) + `lib/schedule.ts`(접종·검진 offset→D-day). 아기정보 미입력 유도 팝업 플래그=`sessionStorage['ssook-baby-prompted']`.

---

## 9. ⛔ 하지 말 것

- **서명키 분실 금지**: `C:\Users\GB\Downloads\아이 쑥쑥 - Google Play package\signing.keystore` + `signing-key-info.txt`(비밀번호 포함)는 **저장소에 없음**. 잃으면 앱 업데이트 **영구 불가** → 별도 백업 유지. 저장소/커밋에 넣지 말 것(비밀번호 노출).
- **`TWA_PACKAGE`(app.vercel.ssook_portal.twa) 변경 금지**: 이미 서명·assetlinks에 묶임. 바꾸면 앱 재발급.
- **`lib/childcare-regions.ts` 손대지 말 것**: 228개 arcode를 API 전수스캔으로 생성한 결과. 커 보여도 삭제·수기수정 금지(재생성 비용 큼).
- **`app/.well-known/assetlinks.json/route.ts` 삭제 금지**: 지우면 앱 주소창(URL바)이 다시 노출됨.
- **환경변수는 시크릿**: `DATA_API_KEY`·`SEOUL_*`·`CHILDCARE_API_KEY`·`TWA_SHA256`를 코드/커밋에 하드코딩 금지(현재 Vercel env에만).
- **도메인/저장소/패키지의 `ssook`·`ssook-portal` 문자열 rename 금지**: 표시명만 아이쑥쑥. 실제 URL·패키지 바꾸면 배포·앱·assetlinks 다 깨짐.
- **로컬에서 `npm run dev`로 검증하려 하지 말 것**: 크래시(환경). 시간 낭비.

---

## 10. ❌ 보류 / 구조적 한계 (재시도 방지)

- **AED 지도**: `DATA_API_KEY`가 국립중앙의료원 **AED 서비스에 미승인(Forbidden)**. 별도 활용신청 없으면 불가 → **기능 제거함**. 되살리려면 해당 서비스 승인 필요.
- **놀이터 정보**: data.go.kr `pfc3`는 **지역 필터 파라미터가 없음**(전국 8.5만건 덤프). 동네별 조회 불가 → 제거함.
- **안전식품(어린이 기호식품)**: 제공받은 식약처 키가 **무효("인증키가 유효하지 않습니다")** → 제거함. 유효 키 재발급 필요.
- **지자체 출산지원금 전국 실제금액**: **공개 구조화 API 없음**(아이사랑 menuno=279는 게시판+PDF첨부). 현재 서울만 수동 구조화(`localgov-data.ts`), 나머지는 검색링크. 확장은 수동 큐레이션뿐.
- **AdSense/AdMob 앱 내 광고**: **TWA에서 AdSense는 정책 위반**, AdMob은 네이티브 SDK 필요(TWA 불가). → 앱·웹 공통 수익화는 **쿠팡 파트너스(제휴링크)**로만. (수익화 자체는 보류 아님 — AdSlot 도입됨. 실링크만 사용자 대기)
- **모바일 실기기 뷰 미검증**: Chrome 창 리사이즈로 모바일 뷰포트 강제가 안 됨(툴 제약). 코드상 반응형은 정상. **실기기 확인 필요(미확인)**.

---

## 11. 디렉토리 구조

```
ssook-portal/
├─ app/
│  ├─ page.tsx layout.tsx globals.css        # 홈·루트·스타일
│  ├─ error.tsx not-found.tsx loading.tsx    # 에러/404/로딩
│  ├─ icon.tsx apple-icon.tsx opengraph-image.tsx manifest.ts sitemap.ts robots.ts
│  ├─ (기능 페이지) timeline support localgov calculator utility
│  │                calendar growth checklist local medical fever seoul privacy /page.tsx
│  ├─ api/                                    # 외부 API 프록시 (§8)
│  │   medical seoul-reserve daycare clinic accident drug
│  │   night-pharmacy screening-clinic appicon screenshot /route.ts(x)
│  └─ .well-known/assetlinks.json/route.ts    # TWA 도메인검증
├─ components/                                # NavBar BabyButton HomeMenu AdSlot
│                                             # TodayPick TimelineChecklist CalendarPersonalize Pager ServiceWorker
├─ lib/                                       # baby schedule regions childcare-regions
│                                             # data growth local-data localgov-data
├─ public/  guide.html  sw.js                 # 정적 가이드 · 서비스워커
├─ ANDROID.md COMPLETENESS.md README.md PROJECT_STATUS.md
└─ next.config.mjs tailwind.config.ts tsconfig.json postcss.config.mjs

(저장소 밖) C:\Users\GB\Downloads\아이 쑥쑥 - Google Play package\
   └─ *.aab *.apk signing.keystore signing-key-info.txt assetlinks.json  # TWA 산출물·서명키(백업 필수)
```

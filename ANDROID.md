# 쑥쑥 포털 — 안드로이드 앱 만들기 (TWA)

> 이미 PWA로 만들어져 있어 **TWA(Trusted Web Activity)** 로 감싸면 Play 스토어 앱이 된다.
> WebView가 아니라 실제 Chrome 엔진 + 이 웹앱을 전체화면으로 띄운다. 코드 재작성 불필요.
> 웹을 업데이트하면 앱도 자동으로 최신(앱 재배포 불필요).

---

## 사전 준비 (코드 쪽 — ✅ 완료됨)

- [x] `manifest.ts` — name·아이콘(192/512)·standalone·theme·shortcuts (TWA 요건 충족)
- [x] service worker (`public/sw.js`) — 오프라인
- [x] favicon·apple-icon
- [x] `/.well-known/assetlinks.json` 라우트 — 도메인 검증용 (환경변수로 값 주입)

## 사용자가 해야 하는 것

1. **Google Play 개발자 계정** — 등록비 **$25 (1회)** · https://play.google.com/console
2. 아래 A 또는 B로 앱 패키지(AAB) 생성
3. Play Console에 업로드 → 스토어 등록정보 작성 → 심사 제출

---

## 방법 A. PWABuilder (권장 · 로컬 툴 0개)

가장 쉬움. Java·Android SDK 설치 불필요.

1. https://www.pwabuilder.com 접속
2. URL 입력: `https://ssook-portal.vercel.app`
3. **Package For Stores → Android** 선택
4. 옵션:
   - Package ID: 예) `app.vercel.ssook_portal.twa` (기억해둘 것 = 나중 `TWA_PACKAGE`)
   - Signing key: **PWABuilder가 새로 생성** 선택 (생성된 `.keystore`와 비밀번호 **반드시 백업**)
5. **Generate** → `.aab`(스토어 업로드용) + `assetlinks.json` 값 + signing 정보 다운로드
6. 다운로드 zip 안 `assetlinks.json`에서 **package_name** 과 **sha256_cert_fingerprints** 값 확인

### 6-1. 도메인 검증값 주입 (주소창 숨기기)

Vercel 환경변수(Production)에 추가 후 재배포:

```
TWA_PACKAGE = app.vercel.ssook_portal.twa      (5번 Package ID)
TWA_SHA256  = AB:CD:...:EF                       (assetlinks의 sha256 지문)
```

→ `https://ssook-portal.vercel.app/.well-known/assetlinks.json` 이 실제 값으로 응답하는지 확인.
(이게 있어야 앱에서 URL 바가 사라지고 "진짜 앱"처럼 보인다.)

7. Play Console → 앱 만들기 → `.aab` 업로드 → 스토어 등록정보(스크린샷·설명·개인정보처리방침 URL `https://ssook-portal.vercel.app/privacy`) → 심사 제출

---

## 방법 B. Bubblewrap (CLI · 세밀한 제어)

Java(JDK 17+) + Android SDK 필요. 이 PC엔 미설치라 설치 선행.

```bash
npm i -g @bubblewrap/cli
bubblewrap init --manifest https://ssook-portal.vercel.app/manifest.webmanifest
# 대화형: 패키지명·앱이름·색상 입력, 서명키 생성
bubblewrap build          # → app-release-signed.aab + assetlinks 지문 출력
```

이후 방법 A의 6-1(환경변수) · 7(업로드) 동일.

---

## 스토어 등록정보 준비물 (사용자)

- [ ] 앱 아이콘 512×512 (있음: `/api/appicon?size=512`)
- [ ] 피처 그래픽 1024×500
- [ ] 스크린샷 2장 이상 (폰에서 앱 캡처)
- [ ] 짧은 설명 / 긴 설명
- [ ] **개인정보처리방침 URL**: `https://ssook-portal.vercel.app/privacy` (준비됨)
- [ ] 카테고리: 의료 또는 육아

---

## 참고

- **서명키(.keystore) 분실 = 앱 업데이트 영구 불가.** 반드시 안전하게 백업.
- 심사는 보통 며칠~1주. 의료정보 앱은 면책·출처 표기가 있어야 통과 유리 (이미 `/privacy`·각 페이지 하단에 있음).
- iOS는 Apple이 TWA를 허용하지 않아 별도 작업 필요(홈 화면 추가 PWA 또는 Capacitor 래핑).

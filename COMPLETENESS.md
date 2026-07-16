# 완성도 평가 루브릭 & 현황

> 웹앱 출시 완성도를 재점검할 때 쓰는 체크리스트. 다른 세션·프로젝트에서도 재사용.
> 쑥쑥 포털 기준 마지막 점검: 2026-07-07 (배포 라이브 실측)

---

## 점검 방법 (재실행)

```bash
# 1. 전 경로 응답 확인
B=https://<도메인>
for u in "/" <각 경로> "/sitemap.xml" "/robots.txt" "/manifest.webmanifest"; do
  echo "$u → $(curl -s -o /dev/null -w '%{http_code}' "$B$u")"
done

# 2. 죽은 코드 / 미사용 export
grep -rn "TODO\|FIXME\|console.log" app components lib
# 삭제한 기능의 라우트·렌더분기·import 잔존 여부

# 3. 접근성: alt 없는 img
grep -rn "<img" app components | grep -v 'alt='

# 4. 브라우저 실측 (Chrome MCP)
#    - 콘솔 에러 0건 확인 (read_console_messages, onlyErrors)
#    - 핵심 인터랙션 1개씩 눌러보기
```

---

## 7대 평가 축 (각 축을 ✅/⚠️/❌로)

### 1. 기능 완성도
- [ ] 핵심 기능이 실제 데이터로 동작 (샘플·목업 아님)
- [ ] 각 기능의 빈 상태·에러 상태·로딩 상태 처리
- [ ] 입력 엣지케이스 (빈값·범위초과·미래날짜 등) 방어

### 2. 안정성 (에러 처리)
- [ ] `not-found` (브랜드 404)
- [ ] `error` 바운더리 (크래시 시 복구 UI)
- [ ] `loading` (전환 피드백)
- [ ] 외부 API 실패 시 graceful fallback (샘플/안내)
- [ ] 콘솔 에러·하이드레이션 경고 0건

### 3. 성능
- [ ] 느린 외부 API 캐싱 (revalidate + CDN s-maxage)
- [ ] 응답 payload 슬림화 (불필요 필드 제거)
- [ ] 실시간성 필요한 것만 캐시 제외
- [ ] 페이지네이션 (대량 목록 분할)

### 4. 접근성 / UX
- [ ] 모든 `<img>`에 alt, 아이콘 버튼에 aria-label
- [ ] 모바일 실기기 확인 (햄버거·터치영역·입력 16px·safe-area)
- [ ] 반응형 (grid-cols 모바일/PC, 가로스크롤 격리)

### 5. SEO / PWA
- [ ] title/description/OG/twitter 메타
- [ ] 동적 OG 이미지 (카톡·SNS 미리보기)
- [ ] sitemap.xml + robots.txt (신규 경로 포함 최신)
- [ ] favicon + apple-icon
- [ ] manifest + service worker (설치·오프라인)

### 6. 법적 / 신뢰
- [ ] 개인정보 처리방침 (수집 범위 정직 명시)
- [ ] 도메인 특화 면책 (의료·금액 등 "참고용, 전문가 우선")
- [ ] 데이터 출처 표기

### 7. 콘텐츠 신선도
- [ ] 연도·금액 등 시효성 데이터 최신 (갱신 주기 명시)
- [ ] 변경내역(changelog) 기록

---

## 현황 스냅샷 (쑥쑥 포털, 2026-07-07)

```
기능        ██████████ 완성
안정성      ██████████ 404·error·loading·콘솔클린
성능        ██████████ API캐시·필드슬림(6.5MB→0.7MB)
접근성/UX   █████████░ alt·aria 양호 / ⚠️ 모바일 실기기 미검증
SEO/PWA     ██████████ 메타·OG·sitemap·설치·오프라인
법적/신뢰   █████████░ 방침·면책 갖춤
신선도      █████████░ 2026 기준 / 매년 1월 갱신 필요
```

**결론: production-ready.** 유일한 미검증 = 모바일 실기기(툴 제약, 코드상 반응형은 정상).
남은 것은 기능 결함이 아니라 성장 과제 → `NEXT_STEPS.md` 참고.

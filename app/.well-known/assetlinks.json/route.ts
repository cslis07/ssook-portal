// Digital Asset Links — TWA(안드로이드 앱)가 이 도메인 소유를 검증해 주소창(URL 바)을 숨긴다.
// PWABuilder/Bubblewrap가 알려주는 값을 Vercel 환경변수에 넣으면 자동 반영:
//   TWA_PACKAGE   = 앱 패키지명 (예: app.vercel.ssook_portal.twa)
//   TWA_SHA256    = 서명 인증서 SHA-256 지문 (콜론 포함 대문자 hex)
// 두 값이 없으면 빈 배열([])을 반환한다(앱 미발급 상태). 설정 후 재배포하면 됨.

export const dynamic = "force-static";

export function GET() {
  const pkg = process.env.TWA_PACKAGE?.trim();
  const sha = process.env.TWA_SHA256?.trim();

  const statements =
    pkg && sha
      ? [
          {
            relation: ["delegate_permission/common.handle_all_urls"],
            target: {
              namespace: "android_app",
              package_name: pkg,
              sha256_cert_fingerprints: [sha],
            },
          },
        ]
      : [];

  return new Response(JSON.stringify(statements), {
    headers: {
      "content-type": "application/json",
      "cache-control": "public, max-age=300",
    },
  });
}

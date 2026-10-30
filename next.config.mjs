/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // '우리 동네' 기능 제거(2026-10-30). 외부 링크·안드로이드 앱 바로가기(/local)가 깨지지 않게 홈으로 보냄
      { source: "/local", destination: "/", permanent: false },
    ];
  },
};
export default nextConfig;

import type { MetadataRoute } from "next";

const BASE = "https://ssook-portal.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "", "/timeline", "/support", "/localgov", "/calculator", "/utility",
    "/calendar", "/growth", "/checklist",
    "/local", "/medical", "/fever", "/seoul", "/privacy",
  ];
  return [
    ...routes.map((path) => ({
      url: `${BASE}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : path === "/calculator" || path === "/support" ? 0.9 : 0.7,
    })),
    { url: `${BASE}/guide.html`, changeFrequency: "monthly" as const, priority: 0.6 },
  ];
}

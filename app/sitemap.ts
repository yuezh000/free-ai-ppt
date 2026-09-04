import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  return [
    { url: base, lastModified: new Date("2026-09-04"), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/pricing`, lastModified: new Date("2026-09-04"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/resources`, lastModified: new Date("2026-09-04"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/blog/powerpoint-slide-size`, lastModified: new Date("2026-09-04"), changeFrequency: "monthly", priority: 0.9 },
  ];
}

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { locales, localizePath } from "@/lib/i18n";
import { templateCategories, templates } from "@/lib/templates";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  const english: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date("2026-09-04"), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/pricing`, lastModified: new Date("2026-09-04"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/resources`, lastModified: new Date("2026-09-05"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/blog/powerpoint-slide-size`, lastModified: new Date("2026-09-04"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/blog/word-to-ppt-ai`, lastModified: new Date("2026-09-05"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/templates`, lastModified: new Date("2026-09-08"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/templates/business`, lastModified: new Date("2026-09-08"), changeFrequency: "weekly", priority: 0.8 },
    ...templateCategories.map((category) => ({ url: `${base}/templates/${category.slug}`, lastModified: new Date("2026-09-08"), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...templates.map((template) => ({ url: `${base}/templates/${template.slug}`, lastModified: new Date("2026-09-08"), changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
  const localized: MetadataRoute.Sitemap = locales.filter((locale) => locale !== "en").flatMap((locale) => [
    { url: `${base}${localizePath(locale)}`, lastModified: new Date("2026-09-04"), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}${localizePath(locale, "/pricing")}`, lastModified: new Date("2026-09-04"), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${base}${localizePath(locale, "/resources")}`, lastModified: new Date("2026-09-04"), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}${localizePath(locale, "/blog/powerpoint-slide-size")}`, lastModified: new Date("2026-09-04"), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${base}${localizePath(locale, "/templates")}`, lastModified: new Date("2026-09-06"), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}${localizePath(locale, "/templates/business")}`, lastModified: new Date("2026-09-06"), changeFrequency: "weekly" as const, priority: 0.8 },
    ...templateCategories.map((category) => ({ url: `${base}${localizePath(locale, `/templates/${category.slug}`)}`, lastModified: new Date("2026-09-08"), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...templates.map((template) => ({ url: `${base}${localizePath(locale, `/templates/${template.slug}`)}`, lastModified: new Date("2026-09-08"), changeFrequency: "monthly" as const, priority: 0.8 })),
  ]);
  return [...english, ...localized];
}

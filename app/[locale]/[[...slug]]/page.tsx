import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedSite } from "@/components/localized-site";
import { isLocale, languageAlternates, locales, localizePath, translations, type Locale } from "@/lib/i18n";

const paths = [[], ["pricing"], ["queue"], ["resources"], ["blog", "powerpoint-slide-size"]] as const;

function pageFromSlug(slug: string[] | undefined) {
  const path = (slug ?? []).join("/");
  if (!path) return "home" as const;
  if (path === "pricing" || path === "queue" || path === "resources") return path;
  if (path === "blog/powerpoint-slide-size") return "article" as const;
  return null;
}

export function generateStaticParams() {
  return locales.filter((locale) => locale !== "en").flatMap((locale) => paths.map((slug) => ({ locale, slug: [...slug] })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug?: string[] }> }): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale) || rawLocale === "en") return {};
  const locale: Locale = rawLocale;
  const page = pageFromSlug(slug);
  if (!page) return {};
  const route = page === "home" ? "" : page === "article" ? "/blog/powerpoint-slide-size" : `/${page}`;
  const base = translations[locale];
  const title = page === "resources" ? `${base.resources.articleTitle} | FreePPT` : page === "article" ? `${base.article.title1} ${base.article.title2} | FreePPT` : page === "pricing" ? `${base.nav.pricing} | FreePPT` : page === "queue" ? `${base.queue.title} | FreePPT` : base.meta.title;
  return {
    title,
    description: page === "article" ? base.article.lead : page === "resources" ? base.resources.lead : base.meta.description,
    alternates: { canonical: localizePath(locale, route), languages: { ...languageAlternates(route), "x-default": route || "/" } },
    robots: page === "queue" ? { index: false, follow: false } : undefined,
  };
}

export default async function LocalePage({ params }: { params: Promise<{ locale: string; slug?: string[] }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || locale === "en") notFound();
  const page = pageFromSlug(slug);
  if (!page) notFound();
  return <LocalizedSite locale={locale} page={page} />;
}

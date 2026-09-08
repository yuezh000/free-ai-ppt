import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedSite } from "@/components/localized-site";
import { LocalizedTemplates } from "@/components/localized-templates";
import { isLocale, languageAlternates, locales, localizePath, translations, type Locale } from "@/lib/i18n";
import { localizedCategoryName, localizedTemplateName, templateCopy } from "@/lib/template-i18n";
import { getTemplate, getTemplateCategory, templateCategories, templates } from "@/lib/templates";

const paths = [[], ["pricing"], ["queue"], ["resources"], ["blog", "powerpoint-slide-size"], ["templates"], ["templates", "business"], ...templateCategories.map(({ slug }) => ["templates", slug]), ...templates.map(({ slug }) => ["templates", slug])] as string[][];

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
  const path = (slug ?? []).join("/");
  if (path === "templates" || path === "templates/business" || path.startsWith("templates/")) {
    const copy = templateCopy(locale);
    const template = path.startsWith("templates/") && path !== "templates/business" ? getTemplate((slug ?? [])[1]) : undefined;
    const category = path.startsWith("templates/") && path !== "templates/business" ? getTemplateCategory((slug ?? [])[1]) : undefined;
    const title = template ? `${localizedTemplateName(template, locale).name} | FreeAIPPT` : category ? `${localizedCategoryName(category, locale)} PowerPoint | FreeAIPPT` : path === "templates/business" ? `${copy.businessTitle1} ${copy.businessTitle2} | FreeAIPPT` : `${copy.badge} | FreeAIPPT`;
    const route = `/${path}`;
    return { title, description: template?.description ?? category?.description ?? (path === "templates/business" ? copy.businessLead : copy.lead), alternates: { canonical: localizePath(locale, route), languages: { ...languageAlternates(route), "x-default": route } } };
  }
  const page = pageFromSlug(slug);
  if (!page) return {};
  const route = page === "home" ? "" : page === "article" ? "/blog/powerpoint-slide-size" : `/${page}`;
  const base = translations[locale];
  const title = page === "resources" ? `${base.resources.articleTitle} | FreeAIPPT` : page === "article" ? `${base.article.title1} ${base.article.title2} | FreeAIPPT` : page === "pricing" ? `${base.nav.pricing} | FreeAIPPT` : page === "queue" ? `${base.queue.title} | FreeAIPPT` : base.meta.title;
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
  const path = (slug ?? []).join("/");
  if (path === "templates" || path === "templates/business" || (path.startsWith("templates/") && (getTemplate((slug ?? [])[1]) || getTemplateCategory((slug ?? [])[1])))) return <LocalizedTemplates locale={locale} slug={slug ?? []} />;
  const page = pageFromSlug(slug);
  if (!page) notFound();
  return <LocalizedSite locale={locale} page={page} />;
}

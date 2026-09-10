import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocumentLocale } from "@/components/document-locale";
import { LocalizedSite } from "@/components/localized-site";
import { LocalizedTemplates } from "@/components/localized-templates";
import { isLocale, languageAlternates, locales, localizePath, translations, type Locale } from "@/lib/i18n";
import { ogLocales, templateSeoCopy } from "@/lib/seo-i18n";
import { SITE_URL } from "@/lib/site";
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
    const seo = templateSeoCopy(locale);
    const template = path.startsWith("templates/") && path !== "templates/business" ? getTemplate((slug ?? [])[1]) : undefined;
    const category = path.startsWith("templates/") && path !== "templates/business" ? getTemplateCategory((slug ?? [])[1]) : undefined;
    const templateName = template ? localizedTemplateName(template, locale) : undefined;
    const categoryName = category ? localizedCategoryName(category, locale) : undefined;
    const title = templateName ? `${templateName.name} | FreeAIPPT` : categoryName ? seo.categoryTitle(categoryName) : path === "templates/business" ? `${copy.businessTitle1} ${copy.businessTitle2} | FreeAIPPT` : `${copy.libraryTitle} | FreeAIPPT`;
    const description = templateName ? seo.templateDescription(templateName.shortName) : categoryName ? seo.categoryDescription(categoryName) : path === "templates/business" ? copy.businessLead : copy.lead;
    const route = `/${path}`;
    const canonical = localizePath(locale, route);
    const image = template ? `/templates/previews/${template.slug}/01.jpg` : "/templates/previews/business-plan-presentation/01.jpg";
    return {
      title,
      description,
      authors: [{ name: "FreeAIPPT", url: SITE_URL }],
      creator: "FreeAIPPT",
      publisher: "FreeAIPPT",
      alternates: { canonical, languages: { ...languageAlternates(route), "x-default": route } },
      robots: { index: true, follow: true },
      openGraph: { title, description, type: "website", url: canonical, siteName: "FreeAIPPT", locale: ogLocales[locale], alternateLocale: locales.filter((item) => item !== locale).map((item) => ogLocales[item]), images: [{ url: image, width: 1600, height: 900, alt: templateName?.name ?? copy.libraryTitle }] },
      twitter: { card: "summary_large_image", title, description, images: [image] },
    };
  }
  const page = pageFromSlug(slug);
  if (!page) return {};
  const route = page === "home" ? "" : page === "article" ? "/blog/powerpoint-slide-size" : `/${page}`;
  const base = translations[locale];
  const title = page === "resources" ? `${base.resources.title1} ${base.resources.title2} | FreeAIPPT` : page === "article" ? `${base.article.title1} ${base.article.title2} | FreeAIPPT` : page === "pricing" ? `${base.pricing.title1} ${base.pricing.title2} | FreeAIPPT` : page === "queue" ? `${base.queue.title} | FreeAIPPT` : base.meta.title;
  const description = page === "article" ? base.article.lead : page === "resources" ? base.resources.lead : page === "pricing" ? base.pricing.lead : page === "queue" ? base.queue.lead : base.meta.description;
  const canonical = localizePath(locale, route);
  return {
    title,
    description,
    authors: [{ name: "FreeAIPPT", url: SITE_URL }],
    creator: "FreeAIPPT",
    publisher: "FreeAIPPT",
    alternates: { canonical, languages: { ...languageAlternates(route), "x-default": route || "/" } },
    robots: page === "queue" ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: { title, description, type: page === "article" ? "article" : "website", url: canonical, siteName: "FreeAIPPT", locale: ogLocales[locale], alternateLocale: locales.filter((item) => item !== locale).map((item) => ogLocales[item]) },
    twitter: { card: "summary", title, description },
  };
}

export default async function LocalePage({ params }: { params: Promise<{ locale: string; slug?: string[] }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || locale === "en") notFound();
  const path = (slug ?? []).join("/");
  if (path === "templates" || path === "templates/business" || (path.startsWith("templates/") && (getTemplate((slug ?? [])[1]) || getTemplateCategory((slug ?? [])[1])))) return <><DocumentLocale locale={locale} /><LocalizedTemplates locale={locale} slug={slug ?? []} /></>;
  const page = pageFromSlug(slug);
  if (!page) notFound();
  const articleJsonLd = page === "article" ? [{
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${translations[locale].article.title1} ${translations[locale].article.title2}`,
    description: translations[locale].article.lead,
    inLanguage: locale,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: `${SITE_URL}${localizePath(locale, "/blog/powerpoint-slide-size")}`,
  }, {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: translations[locale].article.faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
  }] : null;
  return <><DocumentLocale locale={locale} />{articleJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />}<LocalizedSite locale={locale} page={page} /></>;
}

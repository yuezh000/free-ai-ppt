import Link from "next/link";
import { ArrowRight, Check, FileDown, LayoutTemplate, ShieldCheck } from "lucide-react";
import { Header } from "@/components/header";
import { TemplateActions } from "@/components/template-actions";
import { TemplateCard } from "@/components/template-card";
import { TemplateCategoryGrid } from "@/components/template-category-grid";
import { TemplateGallery } from "@/components/template-gallery";
import { localizePath, type Locale } from "@/lib/i18n";
import { templateSeoCopy } from "@/lib/seo-i18n";
import { SITE_URL } from "@/lib/site";
import { localizedCategoryName, localizedTemplateName, templateCopy } from "@/lib/template-i18n";
import { getTemplate, getTemplateCategory, templates } from "@/lib/templates";

const directoryCopy: Record<Locale, { types: string; typeTitle: string; typeLead: string; all: string; count: (value: number) => string }> = {
  en: { types: "12 COMMON PRESENTATION TYPES", typeTitle: "Choose the job your presentation needs to do", typeLead: "Each category contains a focused set of original templates without near-duplicate filler.", all: "ORIGINAL DESIGNS · FREE", count: (value) => `${value} free templates` },
  "zh-CN": { types: "12 种常用演示类型", typeTitle: "先选择这次演示需要完成的任务", typeLead: "每个分类提供一组聚焦、原创的模板，避免堆砌同质设计。", all: "原创设计 · 免费", count: (value) => `${value} 个免费模板` },
  "zh-TW": { types: "12 種常用簡報類型", typeTitle: "先選擇這次簡報需要完成的任務", typeLead: "每個分類提供一組聚焦且原創的範本，避免大量同質設計。", all: "原創設計 · 免費", count: (value) => `${value} 個免費範本` },
  ja: { types: "よく使う12種類のプレゼン", typeTitle: "プレゼンで達成したい目的から選ぶ", typeLead: "各カテゴリに、目的の明確なオリジナルテンプレートを厳選しています。", all: "オリジナルデザイン · 無料", count: (value) => `無料テンプレート ${value}点` },
  ko: { types: "자주 쓰는 12가지 발표 유형", typeTitle: "발표가 해야 할 일부터 선택하세요", typeLead: "각 카테고리에 목적이 분명한 독창적 템플릿을 엄선했습니다.", all: "독창적인 디자인 · 무료", count: (value) => `무료 템플릿 ${value}개` },
  fr: { types: "12 TYPES DE PRÉSENTATIONS COURANTS", typeTitle: "Choisissez le rôle de votre présentation", typeLead: "Chaque catégorie propose une sélection ciblée de modèles originaux, sans variantes superflues.", all: "DESIGNS ORIGINAUX · GRATUITS", count: (value) => `${value} modèles gratuits` },
  es: { types: "12 TIPOS DE PRESENTACIÓN HABITUALES", typeTitle: "Elige lo que debe conseguir tu presentación", typeLead: "Cada categoría ofrece una selección enfocada de diseños originales sin variantes redundantes.", all: "DISEÑOS ORIGINALES · GRATIS", count: (value) => `${value} plantillas gratis` },
  ru: { types: "12 ПОПУЛЯРНЫХ ТИПОВ ПРЕЗЕНТАЦИЙ", typeTitle: "Выберите задачу вашей презентации", typeLead: "В каждой категории собраны самостоятельные оригинальные шаблоны без лишних дублей.", all: "ОРИГИНАЛЬНЫЕ ДИЗАЙНЫ · БЕСПЛАТНО", count: (value) => `${value} бесплатных шаблона` },
};

export function LocalizedTemplates({ locale, slug }: { locale: Locale; slug: string[] }) {
  const t = templateCopy(locale);
  const seo = templateSeoCopy(locale);
  const directory = directoryCopy[locale];
  const path = slug.join("/");
  if (path === "templates") return <main><Header locale={locale} />
    <section className="template-hero"><span className="pill"><LayoutTemplate size={14} /> {t.badge}</span><h1>{t.title1}<br /><em>{t.title2}</em></h1><p>{t.lead}</p><div className="template-trust"><span><Check />{t.noSignup}</span><span><Check />{t.editable}</span><span><Check />{t.widescreen}</span><span><Check />{t.freeUse}</span></div></section>
    <section className="template-library template-categories"><div className="template-library-head"><div><span className="eyebrow">{directory.types}</span><h2>{directory.typeTitle}</h2><p>{directory.typeLead}</p></div><Link href={`${localizePath(locale, "/templates")}#all-free-templates`} className="secondary-button">{t.libraryTitle} <ArrowRight size={16} /></Link></div><TemplateCategoryGrid locale={locale} /></section>
    <section id="all-free-templates" className="template-library"><div className="template-library-head"><div><span className="eyebrow">{templates.length} {directory.all}</span><h2>{t.libraryTitle}</h2><p>{t.libraryLead}</p></div></div><div className="template-grid">{templates.map((item) => <TemplateCard template={item} locale={locale} key={item.slug} />)}</div></section>
  </main>;

  if (path === "templates/business") return <main><Header locale={locale} /><section className="category-hero"><nav className="breadcrumbs"><Link href={localizePath(locale)}>{t.home}</Link><span>/</span><Link href={localizePath(locale, "/templates")}>{t.nav}</Link><span>/</span><span>{t.business}</span></nav><span className="article-kicker"><LayoutTemplate size={14} /> {t.businessBadge}</span><h1>{t.businessTitle1}<br /><em>{t.businessTitle2}</em></h1><p>{t.businessLead}</p></section><section className="template-library"><div className="template-library-head"><div><span className="eyebrow">{templates.length} · {t.freeUse}</span><h2>{t.choose}</h2></div></div><div className="template-grid">{templates.map((item) => <TemplateCard template={item} locale={locale} key={item.slug} />)}</div></section></main>;

  const category = path.startsWith("templates/") ? getTemplateCategory(slug[1]) : undefined;
  if (category) {
    const categoryName = localizedCategoryName(category, locale);
    const categoryTemplates = templates.filter((item) => item.categorySlug === category.slug);
    const description = seo.categoryDescription(categoryName);
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: seo.categoryTitle(categoryName),
      description,
      inLanguage: locale,
      url: `${SITE_URL}${localizePath(locale, `/templates/${category.slug}`)}`,
      publisher: { "@id": `${SITE_URL}/#organization` },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: categoryTemplates.length,
        itemListElement: categoryTemplates.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${SITE_URL}${localizePath(locale, `/templates/${item.slug}`)}`,
          name: localizedTemplateName(item, locale).name,
        })),
      },
    };
    return <main><Header locale={locale} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><section className="category-hero"><nav className="breadcrumbs"><Link href={localizePath(locale)}>{t.home}</Link><span>/</span><Link href={localizePath(locale, "/templates")}>{t.nav}</Link><span>/</span><span>{categoryName}</span></nav><span className="article-kicker"><LayoutTemplate size={14} /> {categoryName}</span><h1>{categoryName}<br /><em>PowerPoint</em></h1><p>{description}</p></section><section className="template-library"><div className="template-library-head"><div><span className="eyebrow">{directory.count(categoryTemplates.length)}</span><h2>{categoryName}</h2></div></div><div className="template-grid">{categoryTemplates.map((item) => <TemplateCard template={item} locale={locale} key={item.slug} />)}</div></section></main>;
  }

  const template = path.startsWith("templates/") ? getTemplate(slug[1]) : undefined;
  if (!template) return null;
  const name = localizedTemplateName(template, locale);
  const related = templates.filter((item) => item.slug !== template.slug).slice(0, 2);
  const categoryName = localizedCategoryName(getTemplateCategory(template.categorySlug)!, locale);
  const description = seo.templateDescription(name.shortName);
  const faq = seo.faq(name.shortName);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: name.name,
      description,
      creator: { "@id": `${SITE_URL}/#organization` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      copyrightHolder: { "@id": `${SITE_URL}/#organization` },
      isAccessibleForFree: true,
      inLanguage: "en",
      mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${localizePath(locale, `/templates/${template.slug}`)}`, inLanguage: locale },
      url: `${SITE_URL}${localizePath(locale, `/templates/${template.slug}`)}`,
      license: `${SITE_URL}/templates/LICENSE.txt`,
      encoding: { "@type": "MediaObject", contentUrl: `${SITE_URL}/templates/files/${template.slug}.pptx`, encodingFormat: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t.home, item: `${SITE_URL}${localizePath(locale)}` },
        { "@type": "ListItem", position: 2, name: t.nav, item: `${SITE_URL}${localizePath(locale, "/templates")}` },
        { "@type": "ListItem", position: 3, name: categoryName, item: `${SITE_URL}${localizePath(locale, `/templates/${template.categorySlug}`)}` },
        { "@type": "ListItem", position: 4, name: name.shortName, item: `${SITE_URL}${localizePath(locale, `/templates/${template.slug}`)}` },
      ],
    },
    { "@context": "https://schema.org", "@type": "FAQPage", inLanguage: locale, mainEntity: faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) },
  ];
  return <main><Header locale={locale} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><article className="template-detail"><nav className="breadcrumbs"><Link href={localizePath(locale)}>{t.home}</Link><span>/</span><Link href={localizePath(locale, "/templates")}>{t.nav}</Link><span>/</span><Link href={localizePath(locale, `/templates/${template.categorySlug}`)}>{categoryName}</Link><span>/</span><span>{name.shortName}</span></nav><header className="template-detail-head"><div><span className="article-kicker"><LayoutTemplate size={14} /> {t.freeEditable}</span><h1>{name.name}</h1><p>{description}</p><p className="template-byline">{seo.byline}</p><div className="template-tags">{seo.tags(categoryName).map((tag) => <span key={tag}>{tag}</span>)}</div></div><TemplateActions slug={template.slug} locale={locale} /></header><section><div className="section-heading"><span>{t.preview}</span><h2>{t.previewTitle}</h2><p>{t.previewLead}</p></div><TemplateGallery template={template} locale={locale} /></section><section className="template-info-grid"><div><span className="eyebrow">{t.about}</span><h2>{t.aboutTitle}</h2><p>{seo.templateAbout(name.shortName, categoryName)}</p><h3>{t.bestFor}</h3><ul>{seo.bestFor(categoryName).map((item) => <li key={item}><Check />{item}</li>)}</ul></div><aside><h3>{t.details}</h3><dl><div><dt>{t.slides.split(" · ")[0]}</dt><dd>8</dd></div><div><dt>{t.format}</dt><dd>PPTX</dd></div><div><dt>{t.ratio}</dt><dd>16:9</dd></div><div><dt>{t.language}</dt><dd>{seo.english}</dd></div><div><dt>{t.fonts}</dt><dd>Aptos</dd></div><div><dt>{t.license}</dt><dd>{t.freeUse}</dd></div></dl><a href="/templates/LICENSE.txt" target="_blank"><ShieldCheck /> {t.readLicense}</a></aside></section><section className="template-provenance" data-testid={`template-${template.slug}-provenance`}><ShieldCheck /><div><span className="eyebrow">FreeAIPPT</span><h2>{seo.trustTitle}</h2><p>{seo.trustBody}</p></div></section><section className="included-section"><span className="eyebrow">{t.included}</span><h2>{t.includedTitle}</h2><div>{seo.included.map((item, index) => <span key={item}><b>{String(index + 1).padStart(2, "0")}</b>{item}</span>)}</div></section><section className="download-band"><FileDown /><div><h2>{t.ready}</h2><p>{t.readyLead}</p></div><TemplateActions slug={template.slug} locale={locale} placement="footer" /></section><section><div className="section-heading"><span>{t.more}</span><h2>{t.related}</h2></div><div className="template-grid related">{related.map((item) => <TemplateCard template={item} locale={locale} key={item.slug} />)}</div></section><section id="faq"><div className="section-heading"><span>FAQ</span><h2>{seo.faqTitle}</h2></div><div className="faq-list">{faq.map((item) => <details key={item.q}><summary>{item.q}<span>+</span></summary><p>{item.a}</p></details>)}</div></section></article></main>;
}

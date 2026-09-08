import Link from "next/link";
import { ArrowRight, Check, FileDown, LayoutTemplate, ShieldCheck } from "lucide-react";
import { Header } from "@/components/header";
import { TemplateActions } from "@/components/template-actions";
import { TemplateCard } from "@/components/template-card";
import { TemplateCategoryGrid } from "@/components/template-category-grid";
import { TemplateGallery } from "@/components/template-gallery";
import { localizePath, type Locale } from "@/lib/i18n";
import { localizedCategoryName, localizedTemplateName, templateCopy } from "@/lib/template-i18n";
import { getTemplate, getTemplateCategory, templates } from "@/lib/templates";

const directoryCopy: Record<Locale, { types: string; typeTitle: string; typeLead: string; all: string; one: string }> = {
  en: { types: "12 COMMON PRESENTATION TYPES", typeTitle: "Choose the job your presentation needs to do", typeLead: "Each category starts with one focused, original template rather than a library of near-duplicates.", all: "ORIGINAL DESIGNS · FREE", one: "free template" },
  "zh-CN": { types: "12 种常用演示类型", typeTitle: "先选择这次演示需要完成的任务", typeLead: "每个分类先提供一个聚焦、原创的模板，避免堆砌大量同质设计。", all: "原创设计 · 免费", one: "个免费模板" },
  "zh-TW": { types: "12 種常用簡報類型", typeTitle: "先選擇這次簡報需要完成的任務", typeLead: "每個分類先提供一個聚焦且原創的範本，避免大量同質設計。", all: "原創設計 · 免費", one: "個免費範本" },
  ja: { types: "よく使う12種類のプレゼン", typeTitle: "プレゼンで達成したい目的から選ぶ", typeLead: "似たデザインを並べず、各カテゴリに焦点を絞ったオリジナルテンプレートを用意しました。", all: "オリジナルデザイン · 無料", one: "無料テンプレート" },
  ko: { types: "자주 쓰는 12가지 발표 유형", typeTitle: "발표가 해야 할 일부터 선택하세요", typeLead: "비슷한 디자인을 나열하지 않고 카테고리마다 목적이 분명한 독창적 템플릿을 제공합니다.", all: "독창적인 디자인 · 무료", one: "무료 템플릿" },
  fr: { types: "12 TYPES DE PRÉSENTATIONS COURANTS", typeTitle: "Choisissez le rôle de votre présentation", typeLead: "Chaque catégorie commence par un modèle original et ciblé, sans accumulation de variantes similaires.", all: "DESIGNS ORIGINAUX · GRATUITS", one: "modèle gratuit" },
  es: { types: "12 TIPOS DE PRESENTACIÓN HABITUALES", typeTitle: "Elige lo que debe conseguir tu presentación", typeLead: "Cada categoría empieza con una plantilla original y enfocada, sin acumular variantes casi iguales.", all: "DISEÑOS ORIGINALES · GRATIS", one: "plantilla gratis" },
  ru: { types: "12 ПОПУЛЯРНЫХ ТИПОВ ПРЕЗЕНТАЦИЙ", typeTitle: "Выберите задачу вашей презентации", typeLead: "В каждой категории — один самостоятельный оригинальный шаблон без множества похожих вариантов.", all: "ОРИГИНАЛЬНЫЕ ДИЗАЙНЫ · БЕСПЛАТНО", one: "бесплатный шаблон" },
};

export function LocalizedTemplates({ locale, slug }: { locale: Locale; slug: string[] }) {
  const t = templateCopy(locale);
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
    return <main><Header locale={locale} /><section className="category-hero"><nav className="breadcrumbs"><Link href={localizePath(locale)}>{t.home}</Link><span>/</span><Link href={localizePath(locale, "/templates")}>{t.nav}</Link><span>/</span><span>{categoryName}</span></nav><span className="article-kicker"><LayoutTemplate size={14} /> {categoryName}</span><h1>{categoryName}<br /><em>PowerPoint</em></h1><p>{category.description}</p></section><section className="template-library"><div className="template-library-head"><div><span className="eyebrow">1 {directory.one}</span><h2>{categoryName}</h2></div></div><div className="template-grid">{categoryTemplates.map((item) => <TemplateCard template={item} locale={locale} key={item.slug} />)}</div></section></main>;
  }

  const template = path.startsWith("templates/") ? getTemplate(slug[1]) : undefined;
  if (!template) return null;
  const name = localizedTemplateName(template, locale);
  const related = templates.filter((item) => item.slug !== template.slug).slice(0, 2);
  const categoryName = localizedCategoryName(getTemplateCategory(template.categorySlug)!, locale);
  return <main><Header locale={locale} /><article className="template-detail"><nav className="breadcrumbs"><Link href={localizePath(locale)}>{t.home}</Link><span>/</span><Link href={localizePath(locale, "/templates")}>{t.nav}</Link><span>/</span><Link href={localizePath(locale, `/templates/${template.categorySlug}`)}>{categoryName}</Link><span>/</span><span>{name.shortName}</span></nav><header className="template-detail-head"><div><span className="article-kicker"><LayoutTemplate size={14} /> {t.freeEditable}</span><h1>{name.name}</h1><p>{template.description}</p><div className="template-tags">{template.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><TemplateActions slug={template.slug} locale={locale} /></header><section><div className="section-heading"><span>{t.preview}</span><h2>{t.previewTitle}</h2><p>{t.previewLead}</p></div><TemplateGallery template={template} locale={locale} /></section><section className="template-info-grid"><div><span className="eyebrow">{t.about}</span><h2>{t.aboutTitle}</h2><p>{template.longDescription}</p><h3>{t.bestFor}</h3><ul>{template.bestFor.map((item) => <li key={item}><Check />{item}</li>)}</ul></div><aside><h3>{t.details}</h3><dl><div><dt>{t.slides.split(" · ")[0]}</dt><dd>8</dd></div><div><dt>{t.format}</dt><dd>PPTX</dd></div><div><dt>{t.ratio}</dt><dd>16:9</dd></div><div><dt>{t.language}</dt><dd>English</dd></div><div><dt>{t.fonts}</dt><dd>Aptos</dd></div><div><dt>{t.license}</dt><dd>{t.freeUse}</dd></div></dl><a href="/templates/LICENSE.txt" target="_blank"><ShieldCheck /> {t.readLicense}</a></aside></section><section className="included-section"><span className="eyebrow">{t.included}</span><h2>{t.includedTitle}</h2><div>{template.included.map((item, index) => <span key={item}><b>{String(index + 1).padStart(2, "0")}</b>{item}</span>)}</div></section><section className="download-band"><FileDown /><div><h2>{t.ready}</h2><p>{t.readyLead}</p></div><TemplateActions slug={template.slug} locale={locale} /></section><section><div className="section-heading"><span>{t.more}</span><h2>{t.related}</h2></div><div className="template-grid related">{related.map((item) => <TemplateCard template={item} locale={locale} key={item.slug} />)}</div></section></article></main>;
}

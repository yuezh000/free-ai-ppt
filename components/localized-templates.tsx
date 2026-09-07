import Link from "next/link";
import { ArrowRight, Check, FileDown, LayoutTemplate, ShieldCheck } from "lucide-react";
import { Header } from "@/components/header";
import { TemplateActions } from "@/components/template-actions";
import { TemplateCard } from "@/components/template-card";
import { TemplateGallery } from "@/components/template-gallery";
import { localizePath, type Locale } from "@/lib/i18n";
import { localizedTemplateName, templateCopy } from "@/lib/template-i18n";
import { getTemplate, templates } from "@/lib/templates";

export function LocalizedTemplates({ locale, slug }: { locale: Locale; slug: string[] }) {
  const t = templateCopy(locale);
  const path = slug.join("/");
  if (path === "templates") return <main><Header locale={locale} />
    <section className="template-hero"><span className="pill"><LayoutTemplate size={14} /> {t.badge}</span><h1>{t.title1}<br /><em>{t.title2}</em></h1><p>{t.lead}</p><div className="template-trust"><span><Check />{t.noSignup}</span><span><Check />{t.editable}</span><span><Check />{t.widescreen}</span><span><Check />{t.freeUse}</span></div></section>
    <section className="template-library"><div className="template-library-head"><div><span className="eyebrow">{t.newFree}</span><h2>{t.libraryTitle}</h2><p>{t.libraryLead}</p></div><Link href={localizePath(locale, "/templates/business")} className="secondary-button">{t.browseBusiness} <ArrowRight size={16} /></Link></div><div className="template-grid">{templates.map((item) => <TemplateCard template={item} locale={locale} key={item.slug} />)}</div></section>
  </main>;

  if (path === "templates/business") return <main><Header locale={locale} /><section className="category-hero"><nav className="breadcrumbs"><Link href={localizePath(locale)}>{t.home}</Link><span>/</span><Link href={localizePath(locale, "/templates")}>{t.nav}</Link><span>/</span><span>{t.business}</span></nav><span className="article-kicker"><LayoutTemplate size={14} /> {t.businessBadge}</span><h1>{t.businessTitle1}<br /><em>{t.businessTitle2}</em></h1><p>{t.businessLead}</p></section><section className="template-library"><div className="template-library-head"><div><span className="eyebrow">3 · {t.freeUse}</span><h2>{t.choose}</h2></div></div><div className="template-grid">{templates.map((item) => <TemplateCard template={item} locale={locale} key={item.slug} />)}</div></section></main>;

  const template = path.startsWith("templates/") ? getTemplate(slug[1]) : undefined;
  if (!template) return null;
  const name = localizedTemplateName(template, locale);
  const related = templates.filter((item) => item.slug !== template.slug).slice(0, 2);
  return <main><Header locale={locale} /><article className="template-detail"><nav className="breadcrumbs"><Link href={localizePath(locale)}>{t.home}</Link><span>/</span><Link href={localizePath(locale, "/templates")}>{t.nav}</Link><span>/</span><Link href={localizePath(locale, "/templates/business")}>{t.business}</Link><span>/</span><span>{name.shortName}</span></nav><header className="template-detail-head"><div><span className="article-kicker"><LayoutTemplate size={14} /> {t.freeEditable}</span><h1>{name.name}</h1><p>{template.description}</p><div className="template-tags">{template.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><TemplateActions slug={template.slug} locale={locale} /></header><section><div className="section-heading"><span>{t.preview}</span><h2>{t.previewTitle}</h2><p>{t.previewLead}</p></div><TemplateGallery template={template} locale={locale} /></section><section className="template-info-grid"><div><span className="eyebrow">{t.about}</span><h2>{t.aboutTitle}</h2><p>{template.longDescription}</p><h3>{t.bestFor}</h3><ul>{template.bestFor.map((item) => <li key={item}><Check />{item}</li>)}</ul></div><aside><h3>{t.details}</h3><dl><div><dt>{t.slides.split(" · ")[0]}</dt><dd>8</dd></div><div><dt>{t.format}</dt><dd>PPTX</dd></div><div><dt>{t.ratio}</dt><dd>16:9</dd></div><div><dt>{t.language}</dt><dd>English</dd></div><div><dt>{t.fonts}</dt><dd>Aptos</dd></div><div><dt>{t.license}</dt><dd>{t.freeUse}</dd></div></dl><a href="/templates/LICENSE.txt" target="_blank"><ShieldCheck /> {t.readLicense}</a></aside></section><section className="included-section"><span className="eyebrow">{t.included}</span><h2>{t.includedTitle}</h2><div>{template.included.map((item, index) => <span key={item}><b>{String(index + 1).padStart(2, "0")}</b>{item}</span>)}</div></section><section className="download-band"><FileDown /><div><h2>{t.ready}</h2><p>{t.readyLead}</p></div><TemplateActions slug={template.slug} locale={locale} /></section><section><div className="section-heading"><span>{t.more}</span><h2>{t.related}</h2></div><div className="template-grid related">{related.map((item) => <TemplateCard template={item} locale={locale} key={item.slug} />)}</div></section></article></main>;
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, Download, FileInput, Info, Layers3, Ruler, Sparkles } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";
import { Generator } from "@/components/generator";
import { Header } from "@/components/header";
import { JobQueue } from "@/components/job-queue";
import { HomeTemplateSamples } from "@/components/home-template-samples";
import { localizePath, translations, type Locale } from "@/lib/i18n";
import { captureConversion, conversionEvents } from "@/lib/analytics";

type PageName = "home" | "pricing" | "queue" | "resources" | "article";

export function LocalizedSite({ locale, page }: { locale: Locale; page: PageName }) {
  const t = translations[locale];
  const [open, setOpen] = useState(false);

  if (page === "home") return (
    <main>
      <Header locale={locale} />
      <section className="hero"><div className="hero-glow" /><div className="hero-copy"><div className="pill"><Sparkles size={14} /> {t.home.badge}</div><h1>{t.home.title1}<br /><em>{t.home.title2}</em></h1><p>{t.home.lead}</p></div><Generator locale={locale} /><div className="trust-row">{t.home.trust.map((item) => <span key={item}><Check size={15} /> {item}</span>)}</div></section><HomeTemplateSamples locale={locale}/>
      <section className="steps-section"><span className="eyebrow">{t.home.eyebrow}</span><h2>{t.home.stepsTitle}</h2><div className="steps-grid">{t.home.steps.map((step, index) => { const Icon = [FileInput, Layers3, Download][index]; return <article key={step.title}><span className="step-number">0{index + 1}</span><Icon /><h3>{step.title}</h3><p>{step.text}</p></article>; })}</div></section>
    </main>
  );

  if (page === "pricing") return (
    <main><Header locale={locale} /><section className="pricing-hero"><span className="pill"><Sparkles size={14} /> {t.pricing.badge}</span><h1>{t.pricing.title1}<br /><em>{t.pricing.title2}</em></h1><p>{t.pricing.lead}</p></section><section className="pricing-grid">{t.pricing.plans.map((plan, index) => <article className={`price-card ${index === 1 ? "featured" : ""}`} key={plan.name}>{index === 1 && <span className="popular">{t.pricing.popular}</span>}<h2>{plan.name}</h2><div className="price"><strong>{plan.price}</strong><span>{plan.unit}</span></div><p>{plan.detail}</p><div className="credit-line"><Check size={17} />{plan.credits}</div><ul>{t.pricing.benefits.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul><button data-testid={`pricing-plan-${index}-select`} onClick={() => { captureConversion(conversionEvents.pricingPlanSelected, { locale, plan_index: index, plan_name: plan.name }); setOpen(true); }} className={index === 1 ? "primary-button" : "secondary-button"}>{plan.button}</button></article>)}</section><p className="pricing-note">{t.pricing.note}</p><ComingSoon locale={locale} source="pricing" open={open} onClose={() => setOpen(false)} /></main>
  );

  if (page === "queue") return (
    <main><Header locale={locale}/><JobQueue locale={locale}/></main>
  );

  if (page === "resources") return (
    <main><Header locale={locale} /><section className="resource-hero"><span className="eyebrow"><BookOpen size={14} /> {t.resources.eyebrow}</span><h1>{t.resources.title1}<br /><em>{t.resources.title2}</em></h1><p>{t.resources.lead}</p></section><section className="resource-list"><div className="section-heading"><span>{t.resources.latest}</span><h2>{t.resources.section}</h2></div><Link href={localizePath(locale, "/blog/powerpoint-slide-size")} className="resource-card"><span className="resource-icon"><Ruler /></span><div><span className="resource-type">{t.resources.type}</span><h3>{t.resources.articleTitle}</h3><p>{t.resources.articleText}</p></div><ArrowRight className="resource-arrow" /></Link></section></main>
  );

  const a = t.article;
  return (
    <main><Header locale={locale} /><article className="article-shell"><header className="article-header"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href={localizePath(locale)}>{a.home}</Link><span>/</span><Link href={localizePath(locale, "/resources")}>{a.resources}</Link><span>/</span><span>{a.crumb}</span></nav><span className="article-kicker"><Ruler size={14} /> {a.kicker}</span><h1>{a.title1}<br /><em>{a.title2}</em></h1><p className="article-lead"><strong>{a.lead}</strong></p><div className="article-meta"><span>{a.read}</span><span>{a.updated}</span></div></header><div className="article-layout"><aside className="article-toc"><strong>{a.kicker}</strong><a href="#quick-reference">{a.reference}</a><a href="#pixels">{a.pixels}</a><a href="#choose">{a.choose}</a><a href="#change-size">{a.change}</a><a href="#faq">FAQ</a></aside><div className="article-content">
      <section className="answer-box"><Info size={20} /><div><strong>{a.short}</strong><p>{a.shortText}</p></div></section>
      <section id="quick-reference"><h2>{a.reference}</h2><p>{a.referenceText}</p><div className="table-wrap"><table><thead><tr><th>{a.format}</th><th>{a.ratio}</th><th>{a.size}</th><th>{a.use}</th></tr></thead><tbody>{a.rows.map((row) => <tr key={row[0]}>{row.map((cell, i) => <td key={cell}>{i === 0 ? <strong>{cell}</strong> : cell}</td>)}</tr>)}</tbody></table></div></section>
      <section id="pixels"><h2>{a.pixels}</h2><p>{a.pixelsText}</p><div className="formula-card"><span>16:9</span><strong>1280 × 720 · 1920 × 1080</strong><p>HD · Full HD</p></div></section>
      <section id="choose"><h2>{a.choose}</h2><p>{a.chooseText}</p></section>
      <section id="change-size"><h2>{a.change}</h2><p>{a.changeText}</p></section>
      <section className="article-cta"><span><Sparkles size={15} /> {a.ctaBadge}</span><h2>{a.ctaTitle}</h2><p>{a.ctaText}</p><Link href={localizePath(locale)} className="primary-button">{a.ctaButton} <ArrowRight size={17} /></Link></section>
      <section id="faq"><h2>{a.faqTitle}</h2><div className="faq-list">{a.faq.map((item) => <details key={item.q}><summary>{item.q}<span>+</span></summary><p>{item.a}</p></details>)}</div></section>
    </div></div></article></main>
  );
}

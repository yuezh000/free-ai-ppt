import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, LayoutTemplate, Sparkles } from "lucide-react";
import { Header } from "@/components/header";
import { TemplateCard } from "@/components/template-card";
import { templates } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Free PowerPoint Templates: Editable PPT Designs | FreeAIPPT",
  description: "Download free, editable PowerPoint templates for business plans, startup pitch decks, company profiles, proposals, and more. No sign-up required.",
  keywords: ["free ppt templates", "free powerpoint templates", "presentation templates free", "editable ppt templates", "ppt templates free download"],
  alternates: { canonical: "/templates" },
};

export default function TemplatesPage() {
  return <main><Header />
    <section className="template-hero"><span className="pill"><LayoutTemplate size={14} /> FREE POWERPOINT TEMPLATES</span><h1>Start with a strong story.<br /><em>Make it yours.</em></h1><p>Download genuinely editable presentation templates, built for real business conversations—not just attractive thumbnails.</p><div className="template-trust"><span><Check />No sign-up</span><span><Check />Editable PPTX</span><span><Check />16:9 widescreen</span><span><Check />Free to use</span></div></section>
    <section className="template-library"><div className="template-library-head"><div><span className="eyebrow">NEW &amp; FREE</span><h2>Professional templates for your next presentation</h2><p>Every deck includes eight purposeful layouts, editable native PowerPoint elements, and clear placeholder content.</p></div><Link href="/templates/business" className="secondary-button">Browse business templates <ArrowRight size={16} /></Link></div><div className="template-grid">{templates.map((template) => <TemplateCard template={template} key={template.slug} />)}</div></section>
    <section className="template-seo"><div><span className="eyebrow">MORE THAN A THEME</span><h2>Free PPT templates designed around the message</h2></div><div><p>A useful PowerPoint template should help you decide what belongs on each slide. These free templates provide a complete narrative structure for common presentation goals, including business planning, fundraising, and company introductions. Each file uses editable text boxes and native shapes so you can change the copy, colors, and layout directly in PowerPoint.</p><p>All sample companies, claims, and numbers are placeholders. Replace them with verified information before presenting. You may use the templates for personal and commercial presentations, but you may not resell or redistribute the template files as standalone products.</p></div></section>
    <section className="template-customize"><Sparkles /><div><span className="eyebrow">NEED SOMETHING SPECIFIC?</span><h2>Customize any template with AI</h2><p>Upload your Word, PDF, Excel, or existing presentation and tell FreeAIPPT what to change. Your first generated deck will be free.</p></div><Link href="/" className="primary-button">Create a presentation <ArrowRight size={16} /></Link></section>
  </main>;
}

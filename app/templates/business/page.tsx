import type { Metadata } from "next";
import Link from "next/link";
import { LayoutTemplate } from "lucide-react";
import { Header } from "@/components/header";
import { TemplateCard } from "@/components/template-card";
import { languageAlternates } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { templates } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Free Business PowerPoint Templates: Editable PPTX | FreeAIPPT",
  description: "Download free business PowerPoint templates for plans, startup pitches, and company profiles. Professionally structured, fully editable, and ready for 16:9 screens.",
  keywords: ["free business powerpoint templates", "business ppt templates free download", "professional powerpoint templates free", "business presentation templates"],
  authors: [{ name: "FreeAIPPT", url: SITE_URL }],
  creator: "FreeAIPPT",
  publisher: "FreeAIPPT",
  alternates: { canonical: "/templates/business", languages: { ...languageAlternates("/templates/business"), "x-default": "/templates/business" } },
  openGraph: { title: "Free Business PowerPoint Templates", description: "Original, editable business presentation templates with no sign-up required.", type: "website", url: "/templates/business", siteName: "FreeAIPPT", locale: "en_US" },
  twitter: { card: "summary", title: "Free Business PowerPoint Templates", description: "Original, editable business presentation templates with no sign-up required." },
};

export default function BusinessTemplatesPage() {
  const businessCategories = new Set(["business-plan", "pitch-deck", "company-profile", "marketing", "project-proposal", "sales-report", "product-roadmap"]);
  const businessTemplates = templates.filter((item) => businessCategories.has(item.categorySlug));
  return <main><Header /><section className="category-hero"><nav className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href="/templates">Templates</Link><span>/</span><span>Business</span></nav><span className="article-kicker"><LayoutTemplate size={14} /> BUSINESS TEMPLATES</span><h1>Free business<br /><em>PowerPoint templates</em></h1><p>Editable presentation structures for planning, pitching, selling, reporting, and aligning teams with clarity.</p></section><section className="template-library"><div className="template-library-head"><div><span className="eyebrow">{businessTemplates.length} FREE DOWNLOADS</span><h2>Choose a business presentation template</h2></div></div><div className="template-grid">{businessTemplates.map((template) => <TemplateCard template={template} key={template.slug} />)}</div></section><section className="template-seo"><div><span className="eyebrow">BUILT FOR REAL WORK</span><h2>How to choose a business PPT template</h2></div><div><p>Choose a template by the decision you need from the audience. A business plan explains how a company will operate and grow. A pitch deck supports a concise fundraising conversation. A company profile establishes credibility, while a report or roadmap aligns a team around evidence and priorities.</p><p>These business PowerPoint templates use a consistent 16:9 format and editable native elements. Begin by replacing the sample narrative, then verify every metric and claim. Adjust colors and fonts to match your brand, simplify any slide that contains more detail than the presenter can explain, and test the final file on the screen used for the meeting.</p></div></section></main>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText, LayoutTemplate, Ruler } from "lucide-react";
import { Header } from "@/components/header";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Presentation Resources & Guides | FreeAIPPT",
  description: "Practical guides for planning, designing, and creating better presentations with PowerPoint and AI.",
  alternates: { canonical: "/resources", languages: { ...languageAlternates("/resources"), "x-default": "/resources" } },
};

export default function ResourcesPage() {
  return (
    <main>
      <Header />
      <section className="resource-hero">
        <span className="eyebrow"><BookOpen size={14} /> FREEAIPPT RESOURCES</span>
        <h1>Make every presentation<br /><em>clearer and stronger.</em></h1>
        <p>Practical answers, tested workflows, and straightforward guides for better slides.</p>
      </section>
      <section className="resource-list">
        <div className="section-heading"><span>Latest guide</span><h2>Presentation essentials</h2></div>
        <Link href="/templates" className="resource-card">
          <span className="resource-icon"><LayoutTemplate /></span>
          <div><span className="resource-type">FREE DOWNLOADS · EDITABLE PPTX</span><h3>Free PowerPoint Templates for Business Presentations</h3><p>Download editable business plan, startup pitch deck, and company profile templates—no sign-up required.</p></div>
          <ArrowRight className="resource-arrow" />
        </Link>
        <Link href="/blog/word-to-ppt-ai" className="resource-card">
          <span className="resource-icon"><FileText /></span>
          <div><span className="resource-type">AI WORKFLOW · 10 MIN READ</span><h3>Word to PPT AI: Convert a Document to PowerPoint Free</h3><p>A practical workflow for turning DOCX files into clear, editable presentations without copying every paragraph by hand.</p></div>
          <ArrowRight className="resource-arrow" />
        </Link>
        <Link href="/blog/powerpoint-slide-size" className="resource-card">
          <span className="resource-icon"><Ruler /></span>
          <div><span className="resource-type">POWERPOINT BASICS · 8 MIN READ</span><h3>PowerPoint Slide Size: Dimensions, Pixels, and How to Change It</h3><p>Find the right dimensions for widescreen, standard, posters, social media, and printed presentations.</p></div>
          <ArrowRight className="resource-arrow" />
        </Link>
      </section>
    </main>
  );
}

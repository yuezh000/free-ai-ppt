import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Ruler } from "lucide-react";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "Presentation Resources & Guides | FreePPT",
  description: "Practical guides for planning, designing, and creating better presentations with PowerPoint and AI.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return (
    <main>
      <Header />
      <section className="resource-hero">
        <span className="eyebrow"><BookOpen size={14} /> FREEPPT RESOURCES</span>
        <h1>Make every presentation<br /><em>clearer and stronger.</em></h1>
        <p>Practical answers, tested workflows, and straightforward guides for better slides.</p>
      </section>
      <section className="resource-list">
        <div className="section-heading"><span>Latest guide</span><h2>Presentation essentials</h2></div>
        <Link href="/blog/powerpoint-slide-size" className="resource-card">
          <span className="resource-icon"><Ruler /></span>
          <div><span className="resource-type">POWERPOINT BASICS · 8 MIN READ</span><h3>PowerPoint Slide Size: Dimensions, Pixels, and How to Change It</h3><p>Find the right dimensions for widescreen, standard, posters, social media, and printed presentations.</p></div>
          <ArrowRight className="resource-arrow" />
        </Link>
      </section>
    </main>
  );
}

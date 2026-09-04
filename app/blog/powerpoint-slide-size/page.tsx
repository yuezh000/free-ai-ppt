import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Info, Ruler, Sparkles } from "lucide-react";
import { Header } from "@/components/header";
import { SITE_URL } from "@/lib/site";

const canonical = "/blog/powerpoint-slide-size";

export const metadata: Metadata = {
  title: "PowerPoint Slide Size: Dimensions, Pixels & How to Change It",
  description: "PowerPoint slide sizes explained: 16:9, 4:3, inches, centimeters, and pixel dimensions. Learn which size to use and how to change it safely.",
  keywords: ["powerpoint slide size", "powerpoint slide dimensions", "powerpoint slide size pixels", "presentation slide size"],
  alternates: { canonical },
  openGraph: {
    title: "PowerPoint Slide Size: The Complete Dimensions Guide",
    description: "Choose the correct slide size for screens, projectors, print, and social media.",
    type: "article",
    url: canonical,
    publishedTime: "2026-09-04T00:00:00Z",
    modifiedTime: "2026-09-04T00:00:00Z",
  },
};

const faq = [
  { q: "What is the standard PowerPoint slide size?", a: "The modern PowerPoint default is Widescreen (16:9), measuring 13.333 × 7.5 inches or 33.867 × 19.05 cm. It is the best default for laptops, TVs, video calls, and most current projectors." },
  { q: "What size is a 16:9 PowerPoint slide in pixels?", a: "PowerPoint uses physical dimensions rather than a fixed pixel canvas. At 96 PPI, a 13.333 × 7.5 inch slide corresponds to approximately 1280 × 720 pixels. At 144 PPI it corresponds to 1920 × 1080 pixels." },
  { q: "Can I change slide size after designing a presentation?", a: "Yes, but objects may move or scale. PowerPoint offers Maximize and Ensure Fit when you change size. Save a copy first, choose Ensure Fit, and inspect text, images, charts, and master layouts afterward." },
  { q: "Should I use 16:9 or 4:3?", a: "Use 16:9 unless a venue, projector, or existing template specifically requires 4:3. Widescreen fits modern displays and online presentation tools, while 4:3 is mainly useful for older equipment and legacy decks." },
];

const jsonLd = [
  {
    "@context": "https://schema.org", "@type": "Article",
    headline: "PowerPoint Slide Size: Dimensions, Pixels, and How to Change It",
    description: "A practical guide to PowerPoint slide dimensions for screens, print, and digital publishing.",
    datePublished: "2026-09-04", dateModified: "2026-09-04",
    author: { "@type": "Organization", name: "FreePPT" },
    publisher: { "@type": "Organization", name: "FreePPT" },
    mainEntityOfPage: `${SITE_URL}${canonical}`,
  },
  {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
  },
];

export default function PowerPointSlideSizePage() {
  return (
    <main>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="article-shell">
        <header className="article-header">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/resources">Resources</Link><span>/</span><span>PowerPoint slide size</span></nav>
          <span className="article-kicker"><Ruler size={14} /> POWERPOINT BASICS</span>
          <h1>PowerPoint slide size:<br /><em>dimensions, pixels, and formats</em></h1>
          <p className="article-lead">The standard PowerPoint slide size is <strong>13.333 × 7.5 inches</strong> for a 16:9 widescreen presentation. That equals 33.867 × 19.05 cm and is roughly equivalent to 1280 × 720 pixels at 96 PPI.</p>
          <div className="article-meta"><span>8 min read</span><span>Updated September 4, 2026</span></div>
        </header>

        <div className="article-layout">
          <aside className="article-toc"><strong>IN THIS GUIDE</strong><a href="#quick-reference">Quick reference</a><a href="#pixels">Pixels explained</a><a href="#choose">Which size to choose</a><a href="#change-size">Change slide size</a><a href="#custom">Custom formats</a><a href="#faq">FAQ</a></aside>
          <div className="article-content">
            <section className="answer-box"><Info size={20} /><div><strong>The short answer</strong><p>Choose <b>Widescreen (16:9)</b> for almost every new presentation. Use Standard (4:3) only for older projectors or legacy templates, and choose a custom size when you are designing for print, signage, or a specific digital platform.</p></div></section>

            <section id="quick-reference"><h2>PowerPoint slide size quick reference</h2><p>PowerPoint stores slide size in inches or centimeters, not pixels. These are the most common built-in and practical presentation dimensions.</p><div className="table-wrap"><table><thead><tr><th>Format</th><th>Aspect ratio</th><th>Inches</th><th>Centimeters</th><th>Common use</th></tr></thead><tbody>
              <tr><td><strong>Widescreen</strong></td><td>16:9</td><td>13.333 × 7.5</td><td>33.867 × 19.05</td><td>Modern screens, video calls</td></tr>
              <tr><td><strong>Standard</strong></td><td>4:3</td><td>10 × 7.5</td><td>25.4 × 19.05</td><td>Older projectors, legacy decks</td></tr>
              <tr><td><strong>On-screen show</strong></td><td>16:10</td><td>10 × 6.25</td><td>25.4 × 15.875</td><td>Some laptops and displays</td></tr>
              <tr><td><strong>Letter paper</strong></td><td>1.29:1</td><td>10 × 7.5*</td><td>25.4 × 19.05*</td><td>Printed handouts</td></tr>
              <tr><td><strong>A4 paper</strong></td><td>1.41:1</td><td>11.69 × 8.27</td><td>29.7 × 21</td><td>International print layouts</td></tr>
            </tbody></table></div><p className="table-note">*PowerPoint&apos;s built-in Letter Paper option reserves printable margins and may not match the full 11 × 8.5-inch page.</p></section>

            <section id="pixels"><h2>PowerPoint slide size in pixels</h2><p>There is no single correct pixel size for a PowerPoint slide. Pixel dimensions depend on the resolution used when the slide is exported as an image or displayed on a screen.</p><div className="formula-card"><span>PIXEL FORMULA</span><strong>inches × pixels per inch = pixels</strong><p>13.333 inches × 96 PPI ≈ 1280 pixels<br />7.5 inches × 96 PPI = 720 pixels</p></div><h3>Common 16:9 pixel equivalents</h3><div className="table-wrap"><table><thead><tr><th>Resolution</th><th>Pixel size</th><th>Best for</th></tr></thead><tbody><tr><td>HD</td><td><strong>1280 × 720</strong></td><td>Small files, online sharing</td></tr><tr><td>Full HD</td><td><strong>1920 × 1080</strong></td><td>Most displays and video</td></tr><tr><td>QHD</td><td><strong>2560 × 1440</strong></td><td>High-resolution screens</td></tr><tr><td>4K UHD</td><td><strong>3840 × 2160</strong></td><td>Large displays and detailed visuals</td></tr></tbody></table></div><p>For images that fill an entire 16:9 slide, 1920 × 1080 pixels is a dependable target. Larger images can look sharper when zoomed, but they also increase the presentation&apos;s file size.</p></section>

            <section id="choose"><h2>Should you choose 16:9 or 4:3?</h2><div className="choice-grid"><div><span>RECOMMENDED</span><h3>Use 16:9 when…</h3><ul><li><Check />Presenting on a modern TV or projector</li><li><Check />Sharing on Zoom, Meet, or Teams</li><li><Check />Recording a presentation as video</li><li><Check />You do not have a required format</li></ul></div><div><span>LEGACY</span><h3>Use 4:3 when…</h3><ul><li><Check />A venue specifically requests it</li><li><Check />Using an older 4:3 projector</li><li><Check />Updating a large legacy slide library</li><li><Check />Your output system crops widescreen slides</li></ul></div></div><p>Ask the event organizer for the display ratio before an important presentation. If that is impossible, 16:9 is the safer modern default.</p></section>

            <section id="change-size"><h2>How to change slide size in PowerPoint</h2><ol className="numbered-steps"><li><span>1</span><div><strong>Open the Design tab</strong><p>Open your presentation and select <b>Design</b> in the top ribbon.</p></div></li><li><span>2</span><div><strong>Select Slide Size</strong><p>Choose <b>Slide Size</b> on the right, then select Widescreen, Standard, or Custom Slide Size.</p></div></li><li><span>3</span><div><strong>Choose a preset or enter dimensions</strong><p>Set the width, height, and orientation. PowerPoint may reverse the displayed width and height when you change orientation.</p></div></li><li><span>4</span><div><strong>Choose Ensure Fit</strong><p>If the deck already contains content, Ensure Fit is usually safer than Maximize. It scales elements down rather than cropping them.</p></div></li><li><span>5</span><div><strong>Inspect every layout</strong><p>Check title slides, charts, full-bleed images, and Slide Master layouts for unexpected movement or empty space.</p></div></li></ol><div className="warning-box"><strong>Before resizing an existing deck</strong><p>Save a separate copy. Changing aspect ratio can reposition text, stretch backgrounds, and alter charts—especially when moving between 4:3 and 16:9.</p></div></section>

            <section id="custom"><h2>Useful custom slide sizes</h2><p>A PowerPoint file can also be used to design posters, digital signs, social graphics, and printed documents. Enter these dimensions under <b>Design → Slide Size → Custom Slide Size</b>.</p><div className="table-wrap"><table><thead><tr><th>Output</th><th>Recommended size</th><th>Orientation</th></tr></thead><tbody><tr><td>Instagram post</td><td>10 × 10 in</td><td>Square</td></tr><tr><td>Instagram story</td><td>7.5 × 13.333 in</td><td>Portrait 9:16</td></tr><tr><td>LinkedIn carousel</td><td>10 × 10 in</td><td>Square</td></tr><tr><td>A4 handout</td><td>8.27 × 11.69 in</td><td>Portrait</td></tr><tr><td>36 × 24 poster</td><td>36 × 24 in</td><td>Landscape</td></tr></tbody></table></div><p>For professional printing, confirm bleed, safe area, color mode, and export requirements with the printer. PowerPoint is convenient, but it is not a full prepress application.</p></section>

            <section className="article-cta"><span><Sparkles size={15} /> FIRST DECK FREE</span><h2>Start with the right format.</h2><p>Describe your presentation or upload an existing document. FreePPT will prepare an editable PPTX and a shareable HTML version.</p><Link href="/" className="primary-button">Create your presentation <ArrowRight size={17} /></Link></section>

            <section id="faq"><h2>Frequently asked questions</h2><div className="faq-list">{faq.map((item) => <details key={item.q}><summary>{item.q}<span>+</span></summary><p>{item.a}</p></details>)}</div></section>
          </div>
        </div>
      </article>
    </main>
  );
}

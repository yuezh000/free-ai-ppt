import { Check, Download, FileInput, Layers3, Sparkles } from "lucide-react";
import { Generator } from "@/components/generator";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <main>
      <Header />
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-copy">
          <div className="pill"><Sparkles size={14} /> YOUR FIRST DECK IS FREE</div>
          <h1>From rough idea to<br /><em>ready-to-present.</em></h1>
          <p>Tell us what you need or upload what you have. FreePPT turns it into a clear, polished presentation—in minutes.</p>
        </div>
        <Generator />
        <div className="trust-row"><span><Check size={15} /> No credit card</span><span><Check size={15} /> Editable PPTX</span><span><Check size={15} /> Shareable HTML</span></div>
      </section>
      <section className="steps-section">
        <span className="eyebrow">THE SIMPLEST WAY TO MAKE A DECK</span>
        <h2>Bring the idea. We&apos;ll build the slides.</h2>
        <div className="steps-grid">
          <article><span className="step-number">01</span><FileInput /><h3>Give us the context</h3><p>Type a brief or attach your Word, PowerPoint, Excel, PDF, and image files.</p></article>
          <article><span className="step-number">02</span><Layers3 /><h3>Join the queue</h3><p>Our AI structures your story, writes the content, and designs every slide.</p></article>
          <article><span className="step-number">03</span><Download /><h3>Download both formats</h3><p>Get an editable PPTX and a responsive HTML presentation—ready to use.</p></article>
        </div>
      </section>
    </main>
  );
}

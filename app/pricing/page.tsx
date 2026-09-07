"use client";

import { Check, Sparkles } from "lucide-react";
import { Header } from "@/components/header";
import { ComingSoon } from "@/components/coming-soon";
import { useState } from "react";
import { captureConversion, conversionEvents } from "@/lib/analytics";

const plans = [
  { name: "First deck", price: "$0", unit: "one time", detail: "Create one complete presentation after signing up.", credits: "1 deck", button: "Start for free" },
  { name: "Single deck", price: "$5", unit: "per deck", detail: "Pay only when you need another polished presentation.", credits: "1 deck", button: "Create a deck", featured: true },
  { name: "10-deck pack", price: "$40", unit: "$4 / deck", detail: "For regular presenters. Credits never expire.", credits: "10 decks · Save 20%", button: "Buy 10 decks" },
  { name: "25-deck pack", price: "$75", unit: "$3 / deck", detail: "For teams and high-volume presentation work.", credits: "25 decks · Save 40%", button: "Buy 25 decks" },
];

export default function Pricing() {
  const [open, setOpen] = useState(false);
  return <main><Header /><section className="pricing-hero"><span className="pill"><Sparkles size={14} /> SIMPLE, CREDIT-BASED PRICING</span><h1>One great deck.<br /><em>One clear price.</em></h1><p>No subscriptions. Start free, then buy presentation credits whenever you need them.</p></section><section className="pricing-grid">{plans.map((plan, index) => <article className={`price-card ${plan.featured ? "featured" : ""}`} key={plan.name}>{plan.featured && <span className="popular">MOST POPULAR</span>}<h2>{plan.name}</h2><div className="price"><strong>{plan.price}</strong><span>{plan.unit}</span></div><p>{plan.detail}</p><div className="credit-line"><Check size={17} />{plan.credits}</div><ul><li><Check size={15} />Editable PPTX download</li><li><Check size={15} />Shareable HTML version</li><li><Check size={15} />Files up to 25 MB</li></ul><button data-testid={`pricing-plan-${index}-select`} onClick={() => { captureConversion(conversionEvents.pricingPlanSelected, { locale: "en", plan_index: index, plan_name: plan.name }); setOpen(true); }} className={plan.featured ? "primary-button" : "secondary-button"}>{plan.button}</button></article>)}</section><p className="pricing-note">Every generation includes both PPTX and HTML formats. Payments are coming soon.</p><ComingSoon source="pricing" open={open} onClose={() => setOpen(false)} /></main>;
}

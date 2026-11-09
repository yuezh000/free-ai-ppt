"use client";

import { Check, Sparkles } from "lucide-react";
import { Header } from "@/components/header";
import { PricingNotice } from "@/components/pricing-notice";
import Link from "next/link";
import { useState } from "react";
import { captureConversion, conversionEvents } from "@/lib/analytics";

const plans = [
  { name: "Free pages", price: "$0", unit: "per account", detail: "Your first 10 generated slides are free after signing up.", credits: "10 slides", button: "Start for free" },
  { name: "10-page credit", price: "$1", unit: "per 10 slides", detail: "Pay only for the pages you need, across any number of decks.", credits: "10 slides", button: "Get 10 slides", featured: true },
  { name: "100-page pack", price: "$8", unit: "$0.80 / 10 slides", detail: "For regular presenters. Page credits never expire.", credits: "100 slides · Save 20%", button: "Get 100 slides" },
  { name: "250-page pack", price: "$15", unit: "$0.60 / 10 slides", detail: "For teams and high-volume presentation work.", credits: "250 slides · Save 40%", button: "Get 250 slides" },
];

export default function Pricing() {
  const [open, setOpen] = useState(false);
  return <main><Header /><section className="pricing-hero"><span className="pill"><Sparkles size={14} /> SIMPLE PAGE-BASED PRICING</span><h1>Only pay for<br /><em>the slides you need.</em></h1><p>Your first 10 slides are free per account. After that, pay $1 per 10 slides or choose a discounted page pack.</p></section><section className="pricing-grid">{plans.map((plan, index) => <article className={`price-card ${plan.featured ? "featured" : ""}`} key={plan.name}>{plan.featured && <span className="popular">MOST POPULAR</span>}<h2>{plan.name}</h2><div className="price"><strong>{plan.price}</strong><span>{plan.unit}</span></div><p>{plan.detail}</p><div className="credit-line"><Check size={17} />{plan.credits}</div><ul><li><Check size={15} />Editable PPTX download</li><li><Check size={15} />Shareable HTML version</li><li><Check size={15} />Files up to 25 MB</li></ul>{index===0?<Link data-testid="pricing-plan-0-select" href="/#generator" onClick={()=>captureConversion(conversionEvents.pricingPlanSelected,{locale:"en",plan_index:0,plan_name:plan.name})} className="secondary-button">{plan.button}</Link>:<button data-testid={`pricing-plan-${index}-select`} onClick={() => { captureConversion(conversionEvents.pricingPlanSelected, { locale: "en", plan_index: index, plan_name: plan.name }); setOpen(true); }} className={plan.featured ? "primary-button" : "secondary-button"}>{plan.button}</button>}</article>)}</section><p className="pricing-note">Slide counts are inferred from your request; without a count, brief complexity determines 6, 8, or 10 slides. Each generation includes PPTX and HTML. Payments are coming soon.</p><PricingNotice open={open} onClose={() => setOpen(false)} /></main>;
}

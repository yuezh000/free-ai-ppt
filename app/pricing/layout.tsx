import type { Metadata } from "next";
import { languageAlternates } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing | FreeAIPPT",
  description: "Your first 10 AI presentation slides are free per account. Then pay $1 per 10 slides, with 20% and 40% discounts on page packs.",
  authors: [{ name: "FreeAIPPT", url: SITE_URL }],
  creator: "FreeAIPPT",
  publisher: "FreeAIPPT",
  alternates: { canonical: "/pricing", languages: { ...languageAlternates("/pricing"), "x-default": "/pricing" } },
  openGraph: { title: "Presentation pricing by slide | FreeAIPPT", description: "First 10 slides free, then $1 per 10 slides with discounted page packs.", type: "website", url: "/pricing", siteName: "FreeAIPPT", locale: "en_US" },
  twitter: { card: "summary", title: "Presentation pricing by slide | FreeAIPPT", description: "First 10 slides free, then $1 per 10 slides with discounted page packs." },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) { return children; }

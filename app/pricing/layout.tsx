import type { Metadata } from "next";
import { languageAlternates } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing | FreeAIPPT",
  description: "Start with one free AI presentation, then create individual decks for $5 or buy discounted credit packs. Every generation includes PPTX and HTML.",
  authors: [{ name: "FreeAIPPT", url: SITE_URL }],
  creator: "FreeAIPPT",
  publisher: "FreeAIPPT",
  alternates: { canonical: "/pricing", languages: { ...languageAlternates("/pricing"), "x-default": "/pricing" } },
  openGraph: { title: "Simple presentation pricing | FreeAIPPT", description: "One free presentation, then pay per deck or buy discounted credit packs.", type: "website", url: "/pricing", siteName: "FreeAIPPT", locale: "en_US" },
  twitter: { card: "summary", title: "Simple presentation pricing | FreeAIPPT", description: "One free presentation, then pay per deck or buy discounted credit packs." },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) { return children; }

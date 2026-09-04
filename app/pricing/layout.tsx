import type { Metadata } from "next";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Pricing | FreePPT",
  alternates: { canonical: "/pricing", languages: { ...languageAlternates("/pricing"), "x-default": "/pricing" } },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) { return children; }

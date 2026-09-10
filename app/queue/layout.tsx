import type { Metadata } from "next";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Presentation generation queue | FreeAIPPT",
  description: "Track FreeAIPPT presentation generation and download completed PPTX and HTML files.",
  alternates: { canonical: "/queue", languages: { ...languageAlternates("/queue"), "x-default": "/queue" } },
  robots: { index: false, follow: false },
  openGraph: { title: "Presentation generation queue | FreeAIPPT", description: "Track FreeAIPPT presentation generation and download completed files.", type: "website", url: "/queue", siteName: "FreeAIPPT", locale: "en_US" },
  twitter: { card: "summary", title: "Presentation generation queue | FreeAIPPT", description: "Track FreeAIPPT presentation generation and download completed files." },
};

export default function QueueLayout({ children }: { children: React.ReactNode }) { return children; }

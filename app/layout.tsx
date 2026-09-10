import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { PostHogProvider } from "@/components/posthog-provider";
import { LocaleDetector } from "@/components/locale-detector";
import { languageAlternates } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "FreeAIPPT — AI presentations from anything",
  description: "Turn a prompt or document into a polished presentation. Try your first deck free.",
  applicationName: "FreeAIPPT",
  authors: [{ name: "FreeAIPPT", url: SITE_URL }],
  creator: "FreeAIPPT",
  publisher: "FreeAIPPT",
  alternates: { canonical: "/", languages: { ...languageAlternates(), "x-default": "/" } },
  robots: { index: true, follow: true },
  openGraph: { title: "FreeAIPPT — AI presentations from anything", description: "Turn a prompt or document into a polished presentation. Try your first deck free.", type: "website", url: "/", siteName: "FreeAIPPT", locale: "en_US" },
  twitter: { card: "summary", title: "FreeAIPPT — AI presentations from anything", description: "Turn a prompt or document into a polished presentation. Try your first deck free." },
};

const siteJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "FreeAIPPT",
    url: SITE_URL,
    description: "FreeAIPPT creates original editable PowerPoint templates and an AI-assisted presentation workflow.",
    knowsAbout: ["PowerPoint template design", "AI-assisted presentations", "Presentation structure", "Editable PPTX files"],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "FreeAIPPT",
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: ["en", "zh-CN", "zh-TW", "ja", "ko", "fr", "es", "ru"],
  },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable}`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
        <PostHogProvider><LocaleDetector />{children}</PostHogProvider>
      </body>
    </html>
  );
}

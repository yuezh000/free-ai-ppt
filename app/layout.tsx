import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { PostHogProvider } from "@/components/posthog-provider";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "FreePPT — AI presentations from anything",
  description: "Turn a prompt or document into a polished presentation. Try your first deck free.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable}`}>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}

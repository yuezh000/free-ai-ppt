"use client";

import { Download, Sparkles } from "lucide-react";
import Link from "next/link";
import { localizePath, type Locale } from "@/lib/i18n";
import { templateCopy } from "@/lib/template-i18n";
import { captureConversion, conversionEvents } from "@/lib/analytics";

export function TemplateActions({ slug, locale = "en", placement = "header" }: { slug: string; locale?: Locale; placement?: "header" | "footer" }) {
  const t = templateCopy(locale);
  const suffix = placement === "footer" ? "-footer" : "";
  return <div className="template-actions">
    <a data-testid={`template-${slug}-download${suffix}`} href={`/templates/files/${slug}.pptx`} download onClick={() => captureConversion(conversionEvents.templateDownloaded, { template: slug, format: "pptx", locale, placement })} className="primary-button"><Download size={17} /> {t.download}</a>
    <Link data-testid={`template-${slug}-customize${suffix}`} href={`${localizePath(locale)}?template=${slug}#generator`} onClick={() => captureConversion(conversionEvents.templateCustomizeClicked, { template: slug, locale, placement })} className="secondary-button"><Sparkles size={17} /> {t.customize}</Link>
    <span>{t.terms}</span>
  </div>;
}

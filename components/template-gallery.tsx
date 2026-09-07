"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { PptTemplate } from "@/lib/templates";
import type { Locale } from "@/lib/i18n";
import { templateCopy } from "@/lib/template-i18n";
import { captureConversion, conversionEvents } from "@/lib/analytics";

function SlidePreview({ template, index, large = false }: { template: PptTemplate; index: number; large?: boolean }) {
  const number = String(index + 1).padStart(2, "0");
  return <div className={`slide-preview ${large ? "large" : ""}`}>
    <Image className="slide-preview-image" src={`/templates/previews/${template.slug}/${number}.jpg`} alt={`${template.shortName} slide ${index + 1}`} width={1600} height={900} />
  </div>;
}

export function TemplateGallery({ template, locale = "en" }: { template: PptTemplate; locale?: Locale }) {
  const t = templateCopy(locale);
  const [selected, setSelected] = useState<number | null>(null);
  useEffect(() => { captureConversion(conversionEvents.templateViewed, { template: template.slug, category: template.category, locale }); }, [template, locale]);
  const show = (index: number) => { setSelected(index); captureConversion(conversionEvents.templatePreviewOpened, { template: template.slug, slide: index + 1, locale }); };
  return <>
    <div className="template-gallery">{template.slides.map((_, index) => <button data-testid={`template-${template.slug}-slide-${index + 1}`} key={index} onClick={() => show(index)} aria-label={`${t.preview} ${index + 1}`}><SlidePreview template={template} index={index} /><small>{index + 1} / {template.slides.length}</small></button>)}</div>
    {selected !== null && <div className="preview-modal" onMouseDown={() => setSelected(null)}><div onMouseDown={(event) => event.stopPropagation()}><button data-testid="template-preview-close" className="preview-close" onClick={() => setSelected(null)} aria-label={t.close}><X /></button><SlidePreview template={template} index={selected} large /><div className="preview-controls"><button data-testid="template-preview-previous" onClick={() => setSelected((selected - 1 + template.slides.length) % template.slides.length)}><ChevronLeft /> {t.previous}</button><span>{selected + 1} / {template.slides.length}</span><button data-testid="template-preview-next" onClick={() => setSelected((selected + 1) % template.slides.length)}>{t.next} <ChevronRight /></button></div></div></div>}
  </>;
}

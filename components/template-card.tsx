import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Layers3, Sparkles } from "lucide-react";
import type { PptTemplate } from "@/lib/templates";
import { localizePath, type Locale } from "@/lib/i18n";
import { localizedTemplateName, templateCopy } from "@/lib/template-i18n";

export function TemplateCard({ template, locale = "en" }: { template: PptTemplate; locale?: Locale }) {
  const t = templateCopy(locale);
  const name = localizedTemplateName(template, locale);
  return <article className="template-card">
    <Link href={localizePath(locale, `/templates/${template.slug}`)} className="template-card-preview"><div className="template-cover"><Image className="template-cover-image" src={`/templates/previews/${template.slug}/01.jpg`} alt={`${name.name} cover`} width={1600} height={900} /></div></Link>
    <div className="template-card-copy"><span><Layers3 size={14} /> {t.slides}</span><h3><Link href={localizePath(locale, `/templates/${template.slug}`)}>{name.name}</Link></h3><p>{template.description}</p><div className="template-card-actions"><Link href={localizePath(locale, `/templates/${template.slug}`)}>{t.preview}<ArrowRight size={15}/></Link><Link data-testid={`template-${template.slug}-use`} href={`${localizePath(locale)}?template=${template.slug}#generator`}><Sparkles size={14}/>{t.customize}</Link></div></div>
  </article>;
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { localizePath, type Locale } from "@/lib/i18n";
import { localizedCategoryName } from "@/lib/template-i18n";
import { templateCategories, templates } from "@/lib/templates";

const copy: Record<Locale, { one: string; open: string }> = {
  en: { one: "1 free template", open: "Open category" },
  "zh-CN": { one: "1 个免费模板", open: "查看分类" },
  "zh-TW": { one: "1 個免費範本", open: "查看分類" },
  ja: { one: "無料テンプレート 1点", open: "カテゴリを見る" },
  ko: { one: "무료 템플릿 1개", open: "카테고리 보기" },
  fr: { one: "1 modèle gratuit", open: "Voir la catégorie" },
  es: { one: "1 plantilla gratis", open: "Ver categoría" },
  ru: { one: "1 бесплатный шаблон", open: "Открыть категорию" },
};

export function TemplateCategoryGrid({ locale = "en" }: { locale?: Locale }) {
  const t = copy[locale];
  return <div className="template-category-grid">
    {templateCategories.map((category) => {
      const template = templates.find((item) => item.categorySlug === category.slug);
      if (!template) return null;
      return <Link data-testid={`template-category-${category.slug}`} href={localizePath(locale, `/templates/${category.slug}`)} className="template-category-card" key={category.slug}>
        <Image src={`/templates/previews/${template.slug}/01.jpg`} alt="" width={480} height={270} />
        <div><small>{t.one}</small><h3>{localizedCategoryName(category, locale)}</h3><p>{category.description}</p><span>{t.open}<ArrowRight size={14} /></span></div>
      </Link>;
    })}
  </div>;
}

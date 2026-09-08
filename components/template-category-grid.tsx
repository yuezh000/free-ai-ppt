import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { localizePath, type Locale } from "@/lib/i18n";
import { localizedCategoryName } from "@/lib/template-i18n";
import { templateCategories, templates } from "@/lib/templates";

const copy: Record<Locale, { count: (value: number) => string; open: string }> = {
  en: { count: (value) => `${value} free templates`, open: "Open category" },
  "zh-CN": { count: (value) => `${value} 个免费模板`, open: "查看分类" },
  "zh-TW": { count: (value) => `${value} 個免費範本`, open: "查看分類" },
  ja: { count: (value) => `無料テンプレート ${value}点`, open: "カテゴリを見る" },
  ko: { count: (value) => `무료 템플릿 ${value}개`, open: "카테고리 보기" },
  fr: { count: (value) => `${value} modèles gratuits`, open: "Voir la catégorie" },
  es: { count: (value) => `${value} plantillas gratis`, open: "Ver categoría" },
  ru: { count: (value) => `${value} бесплатных шаблона`, open: "Открыть категорию" },
};

export function TemplateCategoryGrid({ locale = "en" }: { locale?: Locale }) {
  const t = copy[locale];
  return <div className="template-category-grid">
    {templateCategories.map((category) => {
      const categoryTemplates = templates.filter((item) => item.categorySlug === category.slug);
      const template = categoryTemplates[categoryTemplates.length - 1];
      if (!template) return null;
      return <Link data-testid={`template-category-${category.slug}`} href={localizePath(locale, `/templates/${category.slug}`)} className="template-category-card" key={category.slug}>
        <Image src={`/templates/previews/${template.slug}/01.jpg`} alt="" width={480} height={270} />
        <div><small>{t.count(categoryTemplates.length)}</small><h3>{localizedCategoryName(category, locale)}</h3><p>{category.description}</p><span>{t.open}<ArrowRight size={14} /></span></div>
      </Link>;
    })}
  </div>;
}

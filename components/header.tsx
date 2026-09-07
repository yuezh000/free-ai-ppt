import Link from "next/link";
import { Sparkles } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AuthButton } from "@/components/auth-button";
import { localizePath, translations, type Locale } from "@/lib/i18n";

export function Header({ locale = "en" }: { locale?: Locale }) {
  const t = translations[locale].nav;
  return (
    <header className="site-header">
      <Link href={localizePath(locale)} className="brand" aria-label="FreeAIPPT home">
        <span className="brand-mark"><Sparkles size={18} /></span>
        <span>FreeAIPPT</span>
      </Link>
      <nav>
        <Link href={localizePath(locale, "/templates")}>{locale === "en" ? "Templates" : ({ "zh-CN": "模板", "zh-TW": "範本", ja: "テンプレート", ko: "템플릿", fr: "Modèles", es: "Plantillas", ru: "Шаблоны" } as const)[locale]}</Link>
        <Link href={localizePath(locale, "/resources")}>{t.resources}</Link>
        <Link href={localizePath(locale, "/queue")}>{t.decks}</Link>
        <Link href={localizePath(locale, "/pricing")}>{t.pricing}</Link>
        <LanguageSwitcher locale={locale} />
        <AuthButton locale={locale} />
      </nav>
    </header>
  );
}

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AuthButton } from "@/components/auth-button";
import { localizePath, translations, type Locale } from "@/lib/i18n";

const headerCopy: Record<Locale, { home: string; navigation: string; templates: string }> = {
  en: { home: "FreeAIPPT home", navigation: "Main navigation", templates: "Templates" },
  "zh-CN": { home: "FreeAIPPT 首页", navigation: "主导航", templates: "模板" },
  "zh-TW": { home: "FreeAIPPT 首頁", navigation: "主導覽", templates: "範本" },
  ja: { home: "FreeAIPPT ホーム", navigation: "メインナビゲーション", templates: "テンプレート" },
  ko: { home: "FreeAIPPT 홈", navigation: "기본 탐색", templates: "템플릿" },
  fr: { home: "Accueil FreeAIPPT", navigation: "Navigation principale", templates: "Modèles" },
  es: { home: "Inicio de FreeAIPPT", navigation: "Navegación principal", templates: "Plantillas" },
  ru: { home: "Главная FreeAIPPT", navigation: "Основная навигация", templates: "Шаблоны" },
};

export function Header({ locale = "en" }: { locale?: Locale }) {
  const t = translations[locale].nav;
  const h = headerCopy[locale];
  return (
    <header className="site-header">
      <Link href={localizePath(locale)} className="brand" aria-label={h.home}>
        <span className="brand-mark"><Sparkles size={18} /></span>
        <span>FreeAIPPT</span>
      </Link>
      <nav aria-label={h.navigation}>
        <Link href={localizePath(locale, "/templates")}>{h.templates}</Link>
        <Link href={localizePath(locale, "/resources")}>{t.resources}</Link>
        <Link href={localizePath(locale, "/queue")}>{t.decks}</Link>
        <Link href={localizePath(locale, "/pricing")}>{t.pricing}</Link>
        <LanguageSwitcher locale={locale} />
        <AuthButton locale={locale} />
      </nav>
    </header>
  );
}

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { localizePath, translations, type Locale } from "@/lib/i18n";

export function Header({ locale = "en" }: { locale?: Locale }) {
  const t = translations[locale].nav;
  return (
    <header className="site-header">
      <Link href={localizePath(locale)} className="brand" aria-label="FreePPT home">
        <span className="brand-mark"><Sparkles size={18} /></span>
        <span>FreePPT</span>
      </Link>
      <nav>
        <Link href={localizePath(locale, "/resources")}>{t.resources}</Link>
        <Link href={localizePath(locale, "/queue")}>{t.decks}</Link>
        <Link href={localizePath(locale, "/pricing")}>{t.pricing}</Link>
        <LanguageSwitcher locale={locale} />
        <button className="login-button">{t.signIn}</button>
      </nav>
    </header>
  );
}

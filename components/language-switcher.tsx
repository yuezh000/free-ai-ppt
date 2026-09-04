"use client";

import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { isLocale, localeNames, locales, type Locale } from "@/lib/i18n";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  const changeLanguage = (nextLocale: string) => {
    if (!isLocale(nextLocale)) return;
    localStorage.setItem("freeppt-locale", nextLocale);
    const parts = pathname.split("/").filter(Boolean);
    if (parts[0] && isLocale(parts[0])) parts.shift();
    const suffix = parts.length ? `/${parts.join("/")}` : "";
    router.push(nextLocale === "en" ? suffix || "/" : `/${nextLocale}${suffix}`);
  };

  return (
    <label className="language-select" aria-label={localeNames[locale]}>
      <Languages size={16} />
      <select value={locale} onChange={(event) => changeLanguage(event.target.value)}>
        {locales.map((item) => <option value={item} key={item}>{localeNames[item]}</option>)}
      </select>
    </label>
  );
}

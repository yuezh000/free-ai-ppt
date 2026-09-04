"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";

function browserLocale(): Locale {
  const language = navigator.language.toLowerCase();
  if (language.startsWith("zh-tw") || language.startsWith("zh-hk") || language.startsWith("zh-hant")) return "zh-TW";
  if (language.startsWith("zh")) return "zh-CN";
  if (language.startsWith("ja")) return "ja";
  if (language.startsWith("ko")) return "ko";
  if (language.startsWith("fr")) return "fr";
  if (language.startsWith("es")) return "es";
  if (language.startsWith("ru")) return "ru";
  return "en";
}

export function LocaleDetector() {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (pathname !== "/" || sessionStorage.getItem("freeppt-locale-checked")) return;
    sessionStorage.setItem("freeppt-locale-checked", "1");
    const saved = localStorage.getItem("freeppt-locale");
    const locale = saved && isLocale(saved) ? saved : browserLocale();
    if (locale !== "en") router.replace(`/${locale}`);
  }, [pathname, router]);
  return null;
}

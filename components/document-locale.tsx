"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";

export function DocumentLocale({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    localStorage.setItem("freeppt-locale", locale);
  }, [locale]);

  return null;
}

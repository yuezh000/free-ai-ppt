import type { Locale } from "@/lib/i18n";

export type PageAllowance = { total: number; used: number; remaining: number };

export const pageAllowanceCopy: Record<Locale, { remaining: string; buy: string }> = {
  en: { remaining: "Slides left", buy: "Get more pages" },
  "zh-CN": { remaining: "剩余页数", buy: "购买更多页数" },
  "zh-TW": { remaining: "剩餘頁數", buy: "購買更多頁數" },
  ja: { remaining: "残りのページ数", buy: "ページを追加" },
  ko: { remaining: "남은 페이지", buy: "페이지 더 구매" },
  fr: { remaining: "Diapositives restantes", buy: "Obtenir plus de pages" },
  es: { remaining: "Diapositivas restantes", buy: "Conseguir más páginas" },
  ru: { remaining: "Осталось слайдов", buy: "Получить больше страниц" },
};

export async function loadPageAllowance(token: string): Promise<PageAllowance | null> {
  try {
    const response = await fetch("/api/v1/account/allowance", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const value = await response.json() as Partial<PageAllowance>;
    if (!Number.isInteger(value.total) || !Number.isInteger(value.used) || !Number.isInteger(value.remaining)) return null;
    return value as PageAllowance;
  } catch {
    return null;
  }
}

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const outputRoot = path.join(process.cwd(), "out");
const locales = ["zh-CN", "zh-TW", "ja", "ko", "fr", "es", "ru"];
const categorySlugs = new Set(["business", "business-plan", "pitch-deck", "company-profile", "marketing", "project-proposal", "sales-report", "education", "thesis-defense", "medical", "artificial-intelligence", "portfolio", "product-roadmap"]);
let checked = 0;
let templateDetails = 0;
const englishVariants = new Set();

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(target);
    return entry.isFile() && entry.name.endsWith(".html") ? [target] : [];
  }));
  return nested.flat();
}

for (const locale of locales) {
  const localeRoot = path.join(outputRoot, locale);
  for (const file of await htmlFiles(localeRoot)) {
    const source = await readFile(file, "utf8");
    englishVariants.add(path.relative(localeRoot, file));
    const relative = path.relative(localeRoot, file).replaceAll(path.sep, "/").replace(/(?:\/index)?\.html$/, "");
    const route = relative ? `/${locale}/${relative}` : `/${locale}/`;
    const required = [
      `<html lang="${locale}"`,
      `<meta name="description"`,
      `rel="canonical" href="https://freeaippt.space/${locale}`,
      `hrefLang="${locale}"`,
      `hrefLang="en"`,
      `property="og:locale"`,
      `name="twitter:card"`,
      `FreeAIPPT`,
    ];
    for (const value of required) {
      if (!source.includes(value)) throw new Error(`Missing ${JSON.stringify(value)} in ${route}`);
    }

    const match = relative.match(/^templates\/([^/]+)$/);
    if (match && !categorySlugs.has(match[1])) {
      for (const value of ["CreativeWork", "BreadcrumbList", "FAQPage", "provenance"]) {
        if (!source.includes(value)) throw new Error(`Missing ${value} in template detail ${route}`);
      }
      templateDetails += 1;
    }
    checked += 1;
  }
}

if (templateDetails === 0) throw new Error("No localized template detail pages were checked");
for (const relative of englishVariants) {
  const file = path.join(outputRoot, relative);
  const source = await readFile(file, "utf8");
  const route = relative.replaceAll(path.sep, "/");
  const required = [
    `<html lang="en"`,
    `rel="canonical"`,
    `hrefLang="en"`,
    `hrefLang="x-default"`,
    `property="og:locale"`,
    `name="twitter:card"`,
  ];
  for (const locale of locales) required.push(`hrefLang="${locale}"`);
  for (const value of required) {
    if (!source.includes(value)) throw new Error(`Missing ${JSON.stringify(value)} in English counterpart ${route}`);
  }
}

console.log(`Localized SEO check passed: ${checked} localized pages, ${templateDetails} template details, ${englishVariants.size} reciprocal English pages.`);

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const outputRoot = path.join(process.cwd(), "out");
const locales = new Set(["zh-CN", "zh-TW", "ja", "ko", "fr", "es", "ru"]);

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(target);
    return entry.isFile() && entry.name.endsWith(".html") ? [target] : [];
  }));
  return nested.flat();
}

const files = await htmlFiles(outputRoot);
const counts = Object.fromEntries([...locales].map((locale) => [locale, 0]));

for (const file of files) {
  const [locale] = path.relative(outputRoot, file).split(path.sep);
  if (!locales.has(locale)) continue;
  const source = await readFile(file, "utf8");
  const localized = source.replace(/<html lang="[^"]*"/, `<html lang="${locale}"`);
  if (!localized.includes(`<html lang="${locale}"`)) throw new Error(`Unable to set HTML language for ${file}`);
  if (localized !== source) await writeFile(file, localized);
  counts[locale] += 1;
}

for (const [locale, count] of Object.entries(counts)) {
  if (count === 0) throw new Error(`No exported HTML files found for ${locale}`);
}

console.log(`Localized HTML language attributes updated: ${Object.values(counts).reduce((total, value) => total + value, 0)} pages.`);

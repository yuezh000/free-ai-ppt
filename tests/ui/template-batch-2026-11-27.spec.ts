import { expect, test } from "@playwright/test";

import decks from "../../lib/template-seeds-2026-11-27.json";
import { expectedCategoryCounts } from "./template-category-counts";

const origin = "https://freeaippt.space";

for (const { slug, name, categorySlug } of decks) {
  test(`${slug} opens from its category with preview, download and SEO data`, async ({ page, request }) => {
    await page.goto(`/templates/${categorySlug}`);
    await expect(page.locator(".template-card")).toHaveCount(expectedCategoryCounts[categorySlug]);
    await page.getByRole("heading", { level: 3, name, exact: true }).getByRole("link").click();

    await expect(page).toHaveURL(`/templates/${slug}`);
    await expect(page.getByRole("heading", { level: 1, name, exact: true })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${origin}/templates/${slug}`);
    await expect(page.locator(".template-gallery button")).toHaveCount(8);

    const download = `/templates/files/${slug}.pptx`;
    await expect(page.getByTestId(`template-${slug}-download`)).toHaveAttribute("href", download);
    await expect(page.getByTestId(`template-${slug}-customize`)).toHaveAttribute("href", `/?template=${slug}#generator`);
    const file = await request.get(download);
    expect(file.ok()).toBeTruthy();
    expect((await file.body()).subarray(0, 2).toString()).toBe("PK");

    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    for (const type of ["CreativeWork", "BreadcrumbList", "FAQPage"]) {
      expect(schemas.join(" ")).toContain(type);
    }
  });
}

test("Chinese scale drawing lesson retains its locale and announces all alternates", async ({ page }) => {
  const slug = "scale-drawing-geometry-lesson";
  await page.goto("/zh-CN/templates/education");
  await page.getByRole("heading", { level: 3, name: "免费比例图几何课 PowerPoint 模板", exact: true }).getByRole("link").click();
  await expect(page).toHaveURL(`/zh-CN/templates/${slug}`);
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.getByRole("heading", { level: 1, name: "免费比例图几何课 PowerPoint 模板", exact: true })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${origin}/zh-CN/templates/${slug}`);

  for (const locale of ["en", "zh-CN", "zh-TW", "ja", "ko", "fr", "es", "ru"]) {
    const prefix = locale === "en" ? "" : `/${locale}`;
    await expect(page.locator(`link[rel="alternate"][hreflang="${locale}"]`))
      .toHaveAttribute("href", `${origin}${prefix}/templates/${slug}`);
  }

  await page.getByTestId(`template-${slug}-customize`).click();
  await expect(page).toHaveURL(`/zh-CN?template=${slug}#generator`);
});

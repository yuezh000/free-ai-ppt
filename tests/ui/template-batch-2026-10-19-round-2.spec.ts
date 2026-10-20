import { expect, test } from "@playwright/test";
import seeds from "../../lib/template-seeds-2026-10-19-round-2.json";

for (const deck of seeds) {
  test(`${deck.shortName}: category card, gallery, SEO and editable download`, async ({ page, request }) => {
    await page.goto(`/templates/${deck.categorySlug}`);
    await expect(page.locator(".template-card")).toHaveCount(10);
    await page.getByRole("heading", { level: 3, name: deck.name, exact: true }).getByRole("link").click();
    await expect(page).toHaveURL(new RegExp(`/templates/${deck.slug}/?$`));
    await expect(page.getByRole("heading", { level: 1, name: deck.name, exact: true })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://freeaippt.space/templates/${deck.slug}`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", deck.description);
    await expect(page.locator(".template-gallery button")).toHaveCount(8);
    await expect(page.getByTestId(`template-${deck.slug}-download`)).toHaveAttribute("href", `/templates/files/${deck.slug}.pptx`);
    await expect(page.getByTestId(`template-${deck.slug}-customize`)).toHaveAttribute("href", `/?template=${deck.slug}#generator`);
    const download = await request.get(`/templates/files/${deck.slug}.pptx`);
    expect(download.ok()).toBeTruthy();
    expect((await download.body()).subarray(0, 2).toString()).toBe("PK");
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    for (const type of ["CreativeWork", "BreadcrumbList", "FAQPage"]) expect(schemas.join(" ")).toContain(type);
    await page.getByTestId(`template-${deck.slug}-slide-3`).click();
    await expect(page.locator(".preview-modal img")).toHaveAttribute("src", `/templates/previews/${deck.slug}/03.jpg`);
    await page.getByTestId("template-preview-next").click();
    await expect(page.locator(".preview-modal img")).toHaveAttribute("src", `/templates/previews/${deck.slug}/04.jpg`);
    await page.getByTestId("template-preview-close").click();
  });
}

test("current batch preserves Chinese navigation, naming and template selection", async ({ page }) => {
  const slug = "repair-workshop-business-plan";
  await page.goto("/zh-CN/templates/business-plan");
  await page.getByRole("heading", { level: 3, name: "免费维修工坊商业计划 PowerPoint 模板", exact: true }).getByRole("link").click();
  await expect(page).toHaveURL(new RegExp(`/zh-CN/templates/${slug}/?$`));
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://freeaippt.space/zh-CN/templates/${slug}`);
  for (const locale of ["en", "zh-CN", "zh-TW", "ja", "ko", "fr", "es", "ru"]) {
    await expect(page.locator(`link[rel="alternate"][hreflang="${locale}"]`)).toHaveAttribute("href", `https://freeaippt.space${locale === "en" ? "" : `/${locale}`}/templates/${slug}`);
  }
  await expect(page.getByTestId(`template-${slug}-download`)).toHaveAttribute("href", `/templates/files/${slug}.pptx`);
  await page.getByTestId(`template-${slug}-customize`).click();
  await expect(page).toHaveURL(new RegExp(`/zh-CN\\?template=${slug}#generator$`));
  await expect(page.locator(".selected-template")).toContainText("维修工坊商业计划");
});

test("catalog totals retain every category and a bounded homepage sample", async ({ page }) => {
  await page.goto("/templates");
  for (const slug of ["business-plan", "pitch-deck", "company-profile", "marketing", "project-proposal", "education", "thesis-defense", "medical", "artificial-intelligence", "portfolio", "product-roadmap"]) {
    await expect(page.getByTestId(`template-category-${slug}`)).toContainText("10 free templates");
  }
  await expect(page.getByTestId("template-category-sales-report")).toContainText("9 free templates");
  await expect(page.locator(".template-card")).toHaveCount(119);
  await page.goto("/");
  await expect(page.locator(".home-template-grid article")).toHaveCount(3);
});

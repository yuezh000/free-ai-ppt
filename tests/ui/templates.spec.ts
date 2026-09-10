import { expect, test } from "@playwright/test";

test("template directory exposes twelve focused presentation categories", async ({ page }) => {
  await page.goto("/templates");

  const categories = page.locator(".template-category-card");
  await expect(categories).toHaveCount(12);
  await expect(page.getByTestId("template-category-business-plan")).toContainText("3 free templates");
  await expect(page.getByTestId("template-category-artificial-intelligence")).toBeVisible();
  await expect(page.locator(".template-card")).toHaveCount(36);

  await page.getByTestId("template-category-marketing").click();
  await expect(page).toHaveURL(/\/templates\/marketing\/?$/);
  await expect(page.getByRole("heading", { level: 1, name: "Free Marketing Plan PowerPoint templates", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: "Free Marketing Plan PowerPoint Template", exact: true })).toBeVisible();
  await page.getByRole("heading", { level: 3, name: "Free Event Marketing Plan PowerPoint Template", exact: true }).getByRole("link").click();
  await expect(page).toHaveURL(/\/templates\/event-marketing-plan-presentation\/?$/);
  await expect(page.getByTestId("template-event-marketing-plan-presentation-download")).toHaveAttribute("href", "/templates/files/event-marketing-plan-presentation.pptx");
});

test("localized template category links preserve the selected locale", async ({ page }) => {
  await page.goto("/zh-CN/templates");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.locator(".template-category-card")).toHaveCount(12);

  await page.getByTestId("template-category-product-roadmap").click();
  await expect(page).toHaveURL(/\/zh-CN\/templates\/product-roadmap\/?$/);
  await expect(page.getByRole("heading", { name: "产品路线图", exact: true })).toBeVisible();
  await expect(page.getByText("免费产品路线图 PowerPoint 模板", { exact: true })).toBeVisible();
  await expect(page.getByText("免费季度产品路线图 PowerPoint 模板", { exact: true })).toBeVisible();
  await expect(page.getByText("免费发布列车产品路线图 PowerPoint 模板", { exact: true })).toBeVisible();

  await page.getByRole("heading", { level: 3, name: "免费发布列车产品路线图 PowerPoint 模板", exact: true }).getByRole("link").click();
  await expect(page).toHaveURL(/\/zh-CN\/templates\/release-train-product-roadmap\/?$/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /免费下载/);
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "zh_CN");
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  await expect(page.locator('link[rel="alternate"][hreflang="zh-CN"]')).toHaveAttribute("href", "https://freeaippt.space/zh-CN/templates/release-train-product-roadmap");
  await expect(page.getByText("由 FreeAIPPT 设计并审核", { exact: true })).toBeVisible();
  await expect(page.getByTestId("template-release-train-product-roadmap-provenance")).toContainText("原创设计，制作过程透明");
  await expect(page.getByRole("heading", { name: "常见问题", exact: true })).toBeVisible();
  await expect(page.getByTestId("template-release-train-product-roadmap-download")).toHaveAttribute("href", "/templates/files/release-train-product-roadmap.pptx");
});

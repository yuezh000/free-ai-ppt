import { expect, test } from "@playwright/test";

test("template directory exposes twelve focused presentation categories", async ({ page }) => {
  await page.goto("/templates");

  const categories = page.locator(".template-category-card");
  await expect(categories).toHaveCount(12);
  await expect(page.getByTestId("template-category-business-plan")).toBeVisible();
  await expect(page.getByTestId("template-category-artificial-intelligence")).toBeVisible();

  await page.getByTestId("template-category-marketing").click();
  await expect(page).toHaveURL(/\/templates\/marketing\/?$/);
  await expect(page.getByRole("heading", { level: 1, name: "Free Marketing Plan PowerPoint template", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: "Free Marketing Plan PowerPoint Template", exact: true })).toBeVisible();
});

test("localized template category links preserve the selected locale", async ({ page }) => {
  await page.goto("/zh-CN/templates");
  await expect(page.locator(".template-category-card")).toHaveCount(12);

  await page.getByTestId("template-category-product-roadmap").click();
  await expect(page).toHaveURL(/\/zh-CN\/templates\/product-roadmap\/?$/);
  await expect(page.getByRole("heading", { name: "产品路线图", exact: true })).toBeVisible();
  await expect(page.getByText("免费产品路线图 PowerPoint 模板", { exact: true })).toBeVisible();
});

import { expect, test } from "@playwright/test";

const slug = "activation-milestone-product-roadmap";
const name = "Free Activation Milestone Product Roadmap PowerPoint Template";

test("activation roadmap opens from its category with editable download and SEO data", async ({ page, request }) => {
  await page.goto("/templates/product-roadmap");
  await expect(page.locator(".template-card")).toHaveCount(12);
  await page.getByRole("heading", { level: 3, name, exact: true }).getByRole("link").click();
  await expect(page).toHaveURL(new RegExp(`/templates/${slug}/?$`));
  await expect(page.getByRole("heading", { level: 1, name, exact: true })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://freeaippt.space/templates/${slug}`);
  await expect(page.locator(".template-gallery button")).toHaveCount(8);
  await expect(page.getByTestId(`template-${slug}-download`)).toHaveAttribute("href", `/templates/files/${slug}.pptx`);
  await expect(page.getByTestId(`template-${slug}-customize`)).toHaveAttribute("href", `/?template=${slug}#generator`);
  const file = await request.get(`/templates/files/${slug}.pptx`);
  expect(file.ok()).toBeTruthy();
  expect((await file.body()).subarray(0, 2).toString()).toBe("PK");
  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  for (const type of ["CreativeWork", "BreadcrumbList", "FAQPage"]) expect(schemas.join(" ")).toContain(type);
});

test("Chinese activation roadmap detail retains locale and template selection", async ({ page }) => {
  await page.goto(`/zh-CN/templates/${slug}`);
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://freeaippt.space/zh-CN/templates/${slug}`);
  for (const locale of ["en", "zh-CN", "zh-TW", "ja", "ko", "fr", "es", "ru"]) {
    await expect(page.locator(`link[rel="alternate"][hreflang="${locale}"]`)).toHaveAttribute("href", `https://freeaippt.space${locale === "en" ? "" : `/${locale}`}/templates/${slug}`);
  }
  await page.getByTestId(`template-${slug}-customize`).click();
  await expect(page).toHaveURL(new RegExp(`/zh-CN\\?template=${slug}#generator$`));
});

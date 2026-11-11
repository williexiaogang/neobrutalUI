import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/#compact");
  await page.waitForLoadState("networkidle");
});

test("density preview visual baseline", async ({ page }) => {
  const preview = page.locator("[data-compact-preview]");

  await expect(preview).toHaveScreenshot("density-preview-default.png");

  await page.locator('[data-density-option="compact"]').click();
  await expect(preview).toHaveScreenshot("density-preview-compact.png");

  const tokens = await preview.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      border: style.getPropertyValue("--nb-border-width").trim(),
      largeShadow: style.getPropertyValue("--nb-shadow-lg").trim(),
      extraLargeShadow: style.getPropertyValue("--nb-shadow-xl").trim(),
    };
  });

  expect(tokens.border).toBe("1.5px");
  expect(tokens.largeShadow).toContain("2px 2px 0");
  expect(tokens.extraLargeShadow).toContain("3px 3px 0");
});

test("select trigger visual baseline", async ({ page }) => {
  const demo = page.locator('[data-component="select"] .nb-component-card__demo').first();

  await demo.scrollIntoViewIfNeeded();
  await expect(demo).toHaveScreenshot("select-trigger-default.png");

  await page.locator('[data-density-option="compact"]').click();
  await expect(demo).toHaveScreenshot("select-trigger-compact.png");
});

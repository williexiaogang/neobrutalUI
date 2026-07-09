import { test, expect } from "@playwright/test";

/**
 * Visual regression spec — Button variants
 *
 * Captures the full button showcase page in both light and dark themes.
 */

test.describe("Button variants", () => {
  test("light theme — all variants", async ({ page }) => {
    await page.goto("/#components");
    await page.waitForLoadState("networkidle");
    const card = page.locator('[data-component="button"]');
    await expect(card).toBeVisible();
    await expect(card).toHaveScreenshot("button-light.png");
  });

  test("dark theme — all variants", async ({ page }) => {
    await page.goto("/#components");
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-theme", "neo-brutal-dark");
    });
    await page.waitForTimeout(200); // allow CSS transition
    const card = page.locator('[data-component="button"]');
    await expect(card).toBeVisible();
    await expect(card).toHaveScreenshot("button-dark.png");
  });

  test("hover state — primary button", async ({ page }) => {
    await page.goto("/#components");
    const btn = page.locator('[data-component="button"] .nb-btn-primary').first();
    await expect(btn).toBeVisible();
    await btn.hover();
    await page.waitForTimeout(200);
    await expect(btn).toHaveScreenshot("button-primary-hover.png");
  });

  test("focus-visible state — primary button", async ({ page }) => {
    await page.goto("/#components");
    const btn = page.locator('[data-component="button"] .nb-btn-primary').first();
    await expect(btn).toBeVisible();
    await btn.focus();
    await page.waitForTimeout(200);
    await expect(btn).toHaveScreenshot("button-primary-focus.png");
  });
});

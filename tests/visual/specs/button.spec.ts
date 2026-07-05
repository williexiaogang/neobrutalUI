import { test, expect } from "@playwright/test";

/**
 * Visual regression spec — Button variants
 *
 * Captures the full button showcase page in both light and dark themes.
 */

test.describe("Button variants", () => {
  test("light theme — all variants", async ({ page }) => {
    await page.goto("/components/button");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("button-light.png", {
      fullPage: true,
    });
  });

  test("dark theme — all variants", async ({ page }) => {
    await page.goto("/components/button");
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-theme", "neo-brutal-dark");
    });
    await page.waitForTimeout(200); // allow CSS transition
    await expect(page).toHaveScreenshot("button-dark.png", {
      fullPage: true,
    });
  });

  test("hover state — primary button", async ({ page }) => {
    await page.goto("/components/button");
    const btn = page.locator(".nb-btn-primary").first();
    await btn.hover();
    await page.waitForTimeout(200);
    await expect(btn).toHaveScreenshot("button-primary-hover.png");
  });

  test("focus-visible state — primary button", async ({ page }) => {
    await page.goto("/components/button");
    const btn = page.locator(".nb-btn-primary").first();
    await btn.focus();
    await page.waitForTimeout(200);
    await expect(btn).toHaveScreenshot("button-primary-focus.png");
  });
});

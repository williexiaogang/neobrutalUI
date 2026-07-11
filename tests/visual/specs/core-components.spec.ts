import { test, expect } from "@playwright/test";

/**
 * Visual regression — Core component set (v1 expansion)
 *
 * Covers Card, Input, Alert, Modal, Tabs in light/dark/mobile/focus states.
 */

async function waitForComponent(page, name: string) {
  const card = page.locator(`[data-component="${name}"]`).first();
  await expect(card).toBeVisible();
  return card;
}

const COMPONENTS = [
  { name: "card", selector: '[data-component="card"]' },
  { name: "input", selector: '[data-component="input"]' },
  { name: "alert", selector: '[data-component="alert"]' },
  { name: "modal", selector: '[data-component="modal"]' },
  { name: "tabs", selector: '[data-component="tabs"]' },
];

for (const { name, selector } of COMPONENTS) {
  test.describe(`${name} — light theme`, () => {
    test("desktop", async ({ page }) => {
      await page.goto("/#components");
      await page.waitForLoadState("networkidle");
      const el = page.locator(selector).first();
      await expect(el).toBeVisible();
      await expect(el).toHaveScreenshot(`${name}-light-desktop.png`);
    });

    test("mobile", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/#components");
      await page.waitForLoadState("networkidle");
      const el = page.locator(selector).first();
      await expect(el).toBeVisible();
      await expect(el).toHaveScreenshot(`${name}-light-mobile.png`);
    });
  });

  test.describe(`${name} — dark theme`, () => {
    test("desktop", async ({ page }) => {
      await page.goto("/#components");
      await page.evaluate(() => {
        document.documentElement.setAttribute("data-theme", "neo-brutal-dark");
      });
      await page.waitForTimeout(200);
      const el = page.locator(selector).first();
      await expect(el).toBeVisible();
      await expect(el).toHaveScreenshot(`${name}-dark-desktop.png`);
    });

    test("mobile", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/#components");
      await page.evaluate(() => {
        document.documentElement.setAttribute("data-theme", "neo-brutal-dark");
      });
      await page.waitForTimeout(200);
      const el = page.locator(selector).first();
      await expect(el).toBeVisible();
      await expect(el).toHaveScreenshot(`${name}-dark-mobile.png`);
    });
  });
}

// Focus-visible test for interactive components
const INTERACTIVE = [
  { name: "input", selector: '[data-component="input"] input.nb-input' },
  { name: "tabs", selector: '[data-component="tabs"] [role="tab"].nb-tab' },
];

for (const { name, selector } of INTERACTIVE) {
  test.describe(`${name} — focus-visible`, () => {
    test("desktop", async ({ page }) => {
      await page.goto("/#components");
      const el = page.locator(selector).first();
      await expect(el).toBeVisible();
      await el.focus();
      await page.waitForTimeout(200);
      await expect(el).toHaveScreenshot(`${name}-focus-desktop.png`);
    });
  });
}

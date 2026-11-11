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

test("custom select popup interaction and visual baseline", async ({ page }) => {
  const demo = page.locator("[data-custom-select-demo]");
  const trigger = demo.locator(".nb-dropdown-trigger");
  const listbox = demo.locator('[role="listbox"]');

  await demo.scrollIntoViewIfNeeded();
  await trigger.click();
  await expect(listbox).toBeVisible();
  await expect(demo).toHaveScreenshot("select-popup-open-default.png");

  await demo.locator('[data-value="High"]').click();
  await expect(demo.locator("[data-select-value]")).toHaveText("High");
  await expect(demo.locator("[data-select-input]")).toHaveValue("High");
  await expect(demo.locator('[data-value="High"]')).toHaveAttribute("aria-selected", "true");
  await expect(listbox).toBeHidden();

  await trigger.click();
  await demo.locator('[data-value="Medium"]').click();
  await page.locator('[data-density-option="compact"]').click();
  await trigger.click();
  await expect(listbox).toBeVisible();
  await expect(demo).toHaveScreenshot("select-popup-open-compact.png");

  await page.keyboard.press("Escape");
  await expect(listbox).toBeHidden();
  await expect(trigger).toBeFocused();
});

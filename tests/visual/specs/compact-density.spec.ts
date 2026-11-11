import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/#compact");
  await page.waitForLoadState("networkidle");
});

test("keeps the header, preview, and saved preference in sync", async ({ page }) => {
  const headerToggle = page.locator("[data-density-toggle]");
  const compactOption = page.locator('[data-density-option="compact"]');
  const defaultOption = page.locator('[data-density-option="default"]');

  await compactOption.click();
  await expect(page.locator("html")).toHaveAttribute("data-nb-density", "compact");
  await expect(headerToggle).toHaveAttribute("aria-pressed", "true");
  await expect(headerToggle).toHaveAccessibleName("Compact On");
  await expect(page.locator("[data-density-state]")).toHaveText("On");
  await expect(page.locator("[data-density-preview-label]")).toHaveText("Compact density");

  await page.reload();
  await expect(headerToggle).toHaveAttribute("aria-pressed", "true");
  await expect(compactOption).toHaveAttribute("aria-pressed", "true");

  await headerToggle.click();
  await expect(page.locator("html")).not.toHaveAttribute("data-nb-density", "compact");
  await expect(defaultOption).toHaveAttribute("aria-pressed", "true");
  await expect(headerToggle).toHaveAccessibleName("Compact Off");
  await expect(page.locator("[data-density-state]")).toHaveText("Off");
});

test("reduces the preview and controls without crossing text or target floors", async ({
  page,
}) => {
  const preview = page.locator("[data-compact-preview]");
  const button = preview.locator(".nb-btn-primary");
  const input = preview.locator(".nb-input");
  const coarsePointer = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
  const targetFloor = coarsePointer ? 44 : 24;

  const defaultPreviewHeight = await preview.evaluate(
    (element) => element.getBoundingClientRect().height
  );
  const defaultButtonHeight = await button.evaluate(
    (element) => element.getBoundingClientRect().height
  );

  await page.locator('[data-density-option="compact"]').click();

  const compactPreviewHeight = await preview.evaluate(
    (element) => element.getBoundingClientRect().height
  );
  const compactButtonHeight = await button.evaluate(
    (element) => element.getBoundingClientRect().height
  );

  expect(compactPreviewHeight).toBeLessThan(defaultPreviewHeight);
  if (coarsePointer) {
    expect(compactButtonHeight).toBe(44);
  } else {
    expect(compactButtonHeight).toBeLessThan(defaultButtonHeight);
  }
  expect(compactButtonHeight).toBeGreaterThanOrEqual(targetFloor);
  await expect(input).toHaveCSS("font-size", "16px");
  await expect(preview.locator(".nb-stat-desc").first()).toHaveCSS("font-size", "14px");
});

test("supports compact density on an individual component", async ({ page }) => {
  await page.evaluate(() => {
    const fixture = document.createElement("div");
    fixture.innerHTML = `
      <button class="nb-btn nb-btn-icon nb-compact" aria-label="Close">×</button>
      <input class="nb-checkbox nb-compact" type="checkbox" aria-label="Enabled" />
      <progress class="nb-progress nb-compact" value="50" max="100"></progress>
      <div class="nb-skeleton nb-skeleton-circle nb-compact"></div>
    `;
    document.body.append(fixture);
  });

  const targetFloor = (await page.evaluate(() => matchMedia("(pointer: coarse)").matches))
    ? 44
    : 24;
  await expect(page.locator(".nb-btn-icon.nb-compact")).toHaveCSS("width", `${targetFloor}px`);
  await expect(page.locator(".nb-btn-icon.nb-compact")).toHaveCSS("height", `${targetFloor}px`);
  await expect(page.locator(".nb-progress.nb-compact")).toHaveCSS("height", "8px");
  await expect(page.locator(".nb-skeleton-circle.nb-compact")).toHaveCSS("width", "32px");
  await expect(page.locator(".nb-skeleton-circle.nb-compact")).toHaveCSS("height", "32px");

  const hitArea = await page.locator(".nb-checkbox.nb-compact").evaluate((element) => {
    const pseudo = getComputedStyle(element, "::before");
    return { width: pseudo.width, height: pseudo.height };
  });
  expect(hitArea).toEqual({ width: `${targetFloor}px`, height: `${targetFloor}px` });
});

test("keeps touch controls at least 44px in compact mode", async ({ page }) => {
  test.skip(
    !(await page.evaluate(() => matchMedia("(pointer: coarse)").matches)),
    "Requires a coarse pointer"
  );

  await page.locator('[data-density-option="compact"]').click();
  const buttonHeight = await page
    .locator("[data-compact-preview] .nb-btn-primary")
    .evaluate((element) => element.getBoundingClientRect().height);

  expect(buttonHeight).toBeGreaterThanOrEqual(44);
});

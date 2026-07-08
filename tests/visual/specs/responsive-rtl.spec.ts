import { test, expect } from "@playwright/test";

/**
 * Responsive + RTL structural checks
 *
 * Verifies that key pages do not produce horizontal overflow at a narrow
 * mobile viewport and that setting dir="rtl" does not break layout.
 */

const pages = ["/", "/components", "/playground", "/rtl"];

async function assertNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
      bodyClientWidth: document.body.clientWidth,
    };
  });

  expect(
    overflow.scrollWidth,
    `documentElement scrollWidth (${overflow.scrollWidth}) should not exceed clientWidth (${overflow.clientWidth})`
  ).toBeLessThanOrEqual(overflow.clientWidth);
  expect(
    overflow.bodyScrollWidth,
    `body scrollWidth (${overflow.bodyScrollWidth}) should not exceed clientWidth (${overflow.bodyClientWidth})`
  ).toBeLessThanOrEqual(overflow.bodyClientWidth);
}

test.describe("responsive overflow", () => {
  for (const url of pages) {
    test(`${url} has no horizontal overflow at mobile viewport`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 720 });
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      await assertNoHorizontalOverflow(page);
    });
  }
});

test.describe("RTL layout", () => {
  for (const url of pages) {
    test(`${url} has no horizontal overflow under dir="rtl"`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto(url);
      await page.waitForLoadState("networkidle");

      await page.evaluate(() => {
        document.documentElement.setAttribute("dir", "rtl");
      });

      // Wait for any layout reflow
      await page.waitForTimeout(200);
      await assertNoHorizontalOverflow(page);
    });
  }
});

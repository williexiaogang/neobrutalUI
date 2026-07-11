import { test, expect } from "@playwright/test";

/**
 * 200% zoom + long-text overflow stress tests
 *
 * Verifies that component cards remain usable at 200% browser zoom
 * and that long-text heuristics do not produce clipping.
 */

const ZOOM_PAGES = ["/", "/components", "/playground"];

async function assertNoClippedText(page) {
  const clipped = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll(".nb-component-card__description, .nb-component-card__title, .nb-alert-title, .nb-alert-body, .nb-card-title, .nb-card-body"));
    return els.filter((el) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      const overflow = style.overflow + style.overflowX + style.overflowY;
      const hasOverflowHidden = overflow.includes("hidden");
      const isClipped = el.scrollWidth > rect.width || el.scrollHeight > rect.height;
      return hasOverflowHidden && isClipped;
    }).map((el) => el.textContent?.slice(0, 50));
  });

  expect(clipped).toEqual([]);
}

test.describe("200% zoom — no overflow", () => {
  for (const url of ZOOM_PAGES) {
    test(`${url} at 200% zoom`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto(url);
      await page.waitForLoadState("networkidle");

      // Simulate 200% zoom via devicePixelRatio + viewport scaling
      await page.evaluate(() => {
        document.documentElement.style.zoom = "2";
      });
      await page.waitForTimeout(300);

      await assertNoClippedText(page);
    });
  }
});

test.describe("long text — wrap behavior", () => {
  test("card title with 200 chars does not overflow", async ({ page }) => {
    await page.goto("/#components");
    const card = page.locator('[data-component="card"]').first();
    await expect(card).toBeVisible();

    // Inject a long title into the first card
    await card.evaluate((el) => {
      const title = el.querySelector(".nb-card-title, .nb-component-card__title");
      if (title) {
        title.textContent = "This is an extremely long card title that should wrap gracefully without breaking the layout or clipping the text in any way shape or form whatsoever".repeat(3);
      }
    });

    await page.waitForTimeout(100);
    await assertNoClippedText(page);
  });

  test("alert body with long message wraps", async ({ page }) => {
    await page.goto("/#components");
    const alert = page.locator('[data-component="alert"]').first();
    await expect(alert).toBeVisible();

    await alert.evaluate((el) => {
      const body = el.querySelector(".nb-alert-body");
      if (body) {
        body.textContent = "This is a very long alert message that should wrap across multiple lines without causing any horizontal overflow or clipping issues in the container. ".repeat(10);
      }
    });

    await page.waitForTimeout(100);
    await assertNoClippedText(page);
  });
});

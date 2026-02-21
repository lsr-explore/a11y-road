import { expect, test } from "@playwright/test";

test("homepage loads and has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Hello from A11y Road | A11y Road/);
});

test("docs page is reachable from navbar", async ({ page, isMobile }) => {
  await page.goto("/");

  if (isMobile) {
    // Open the hamburger menu on mobile viewports
    await page.getByRole("button", { name: "Toggle navigation bar" }).click();
  }

  await page
    .getByRole("navigation", { name: "Main" })
    .getByRole("link", { name: "Tutorial" })
    .click();
  await expect(page).toHaveURL(/\/docs\//);
});

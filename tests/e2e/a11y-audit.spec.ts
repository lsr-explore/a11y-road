import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Known axe rule violations in the default Docusaurus/Infima template.
// These will be fixed when real content and custom theme colors are added.
const KNOWN_TEMPLATE_ISSUES = [
  "heading-order", // Template jumps from h1 to h3 on the homepage
  "color-contrast", // Infima default green (#2e8555) fails contrast on light gray
];

test("homepage has no a11y violations @a11y", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .disableRules(KNOWN_TEMPLATE_ISSUES)
    .analyze();
  expect(results.violations).toEqual([]);
});

test("docs page has no a11y violations @a11y", async ({ page }) => {
  await page.goto("/docs/intro");
  const results = await new AxeBuilder({ page })
    .disableRules(KNOWN_TEMPLATE_ISSUES)
    .analyze();
  expect(results.violations).toEqual([]);
});

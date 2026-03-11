import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Accessibility audit', () => {
  test('landing page has no critical a11y violations when accessible mode is on', async ({
    page,
  }) => {
    await page.goto('/');

    // Enable accessible mode
    await page.evaluate(() => {
      sessionStorage.setItem('a11y-kit-mode', 'true');
    });
    await page.reload();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('contact page has no critical a11y violations when accessible mode is on', async ({
    page,
  }) => {
    await page.goto('/contact');

    // Enable accessible mode
    await page.evaluate(() => {
      sessionStorage.setItem('a11y-kit-mode', 'true');
    });
    await page.reload();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('landing page has a11y violations when accessible mode is off', async ({ page }) => {
    await page.goto('/');

    // Ensure accessible mode is off
    await page.evaluate(() => {
      sessionStorage.setItem('a11y-kit-mode', 'false');
    });
    await page.reload();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations.length).toBeGreaterThan(0);
  });
});

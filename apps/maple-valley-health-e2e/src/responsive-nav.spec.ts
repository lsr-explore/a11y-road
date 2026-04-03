import { expect, test } from '@playwright/test';

const desktopSizes = {
  desktop: { width: 1280, height: 800 },
  'small-desktop': { width: 1024, height: 768 },
  'ipad-landscape': { width: 1024, height: 768 },
} as const;

const mobileSizes = {
  'ipad-portrait': { width: 768, height: 1024 },
  'mobile-landscape': { width: 844, height: 390 },
  'mobile-portrait': { width: 390, height: 844 },
} as const;

/* ------------------------------------------------------------------ */
/*  Demo site – desktop viewports                                     */
/* ------------------------------------------------------------------ */
test.describe('Demo site desktop navigation', () => {
  for (const [name, size] of Object.entries(desktopSizes)) {
    test.describe(`at ${name} (${size.width}x${size.height})`, () => {
      test.use({ viewport: size });

      test('both nav bars are visible with all links', async ({ page }) => {
        await page.goto('/maple-valley-health');

        const platformNav = page.getByLabel('Platform navigation');
        const siteNav = page.getByLabel('Site navigation');
        await expect(platformNav).toBeVisible();
        await expect(siteNav).toBeVisible();

        await expect(siteNav.getByRole('link', { name: 'Home' })).toBeVisible();
        await expect(siteNav.getByRole('link', { name: 'Team' })).toBeVisible();
        await expect(siteNav.getByRole('link', { name: 'Contact' })).toBeVisible();
        await expect(platformNav.getByRole('link', { name: 'Tutorial' })).toBeVisible();
      });

      test('A11y Road link points to hub', async ({ page }) => {
        await page.goto('/maple-valley-health');

        const a11yRoadLink = page.getByRole('link', { name: 'A11y Road' }).first();
        await expect(a11yRoadLink).toBeVisible();
        await expect(a11yRoadLink).toHaveAttribute('href', '/');
      });

      test('footer shows demo site text', async ({ page }) => {
        await page.goto('/maple-valley-health');
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        await expect(page.getByText('Demo Site for Accessibility Learning')).toBeVisible();
        await expect(page.getByText('About this project')).toBeVisible();
      });
    });
  }
});

/* ------------------------------------------------------------------ */
/*  Demo site – mobile viewports                                      */
/* ------------------------------------------------------------------ */
test.describe('Demo site mobile navigation', () => {
  for (const [name, size] of Object.entries(mobileSizes)) {
    test.describe(`at ${name} (${size.width}x${size.height})`, () => {
      test.use({ viewport: size });

      test('hamburger opens sheet with all nav links', async ({ page }) => {
        await page.goto('/maple-valley-health');

        const menuButton = page.getByLabel('Open navigation menu');
        await expect(menuButton).toBeVisible();
        await menuButton.click();

        await expect(page.getByText('Maple Valley Health', { exact: false }).first()).toBeVisible();
        await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Team' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Tutorial' })).toBeVisible();
      });

      test('A11y Road link points to hub', async ({ page }) => {
        await page.goto('/maple-valley-health');

        const a11yRoadLink = page.getByRole('link', { name: 'A11y Road' }).first();
        await expect(a11yRoadLink).toBeVisible();
        await expect(a11yRoadLink).toHaveAttribute('href', '/');
      });

      test('footer shows demo site text', async ({ page }) => {
        await page.goto('/maple-valley-health');
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        await expect(page.getByText('Demo Site for Accessibility Learning')).toBeVisible();
        await expect(page.getByText('About this project')).toBeVisible();
      });
    });
  }

  test.describe('mobile menu interaction', () => {
    test.use({ viewport: mobileSizes['mobile-portrait'] });

    test('menu opens and closes correctly', async ({ page }) => {
      await page.goto('/maple-valley-health');

      const menuButton = page.getByLabel('Open navigation menu');
      await menuButton.click();

      const closeButton = page.getByRole('button', { name: 'Close' });
      await expect(closeButton).toBeVisible();

      await closeButton.click();
      await expect(closeButton).toBeHidden();
    });

    test('menu link navigates and closes sheet', async ({ page }) => {
      await page.goto('/maple-valley-health');

      const menuButton = page.getByLabel('Open navigation menu');
      await menuButton.click();

      await page.getByRole('link', { name: 'Team' }).click();
      await expect(page).toHaveURL(/\/maple-valley-health\/team/);
    });
  });
});

/* ------------------------------------------------------------------ */
/*  Tutorial – desktop viewports                                      */
/* ------------------------------------------------------------------ */
test.describe('Tutorial desktop navigation', () => {
  for (const [name, size] of Object.entries(desktopSizes)) {
    test.describe(`at ${name} (${size.width}x${size.height})`, () => {
      test.use({ viewport: size });

      test('header shows search and Demo link', async ({ page }) => {
        await page.goto('/tutorial');

        await expect(page.getByRole('link', { name: 'A11y Road' }).first()).toBeVisible();
        await expect(page.locator('#tutorial-search-input')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Demo' })).toBeVisible();
      });
    });
  }
});

/* ------------------------------------------------------------------ */
/*  Tutorial – mobile viewports                                       */
/* ------------------------------------------------------------------ */
test.describe('Tutorial mobile navigation', () => {
  for (const [name, size] of Object.entries(mobileSizes)) {
    test.describe(`at ${name} (${size.width}x${size.height})`, () => {
      test.use({ viewport: size });

      test('header shows hamburger and search icon', async ({ page }) => {
        await page.goto('/tutorial');

        await expect(page.getByRole('link', { name: 'A11y Road' }).first()).toBeVisible();
        await expect(page.getByLabel('Open navigation menu')).toBeVisible();
        await expect(page.getByLabel(/search/i).first()).toBeVisible();
      });

      test('search is hidden until toggled', async ({ page }) => {
        await page.goto('/tutorial');

        const searchInput = page.locator('#tutorial-search-input');
        await expect(searchInput).toBeHidden();

        await page
          .getByLabel(/search/i)
          .first()
          .click();
        await expect(searchInput).toBeVisible();
      });
    });
  }

  test.describe('tutorial mobile search', () => {
    test.use({ viewport: mobileSizes['mobile-portrait'] });

    test('search expands and navigates to results', async ({ page }) => {
      await page.goto('/tutorial');

      await page
        .getByLabel(/search/i)
        .first()
        .click();

      const searchInput = page.locator('#tutorial-search-input');
      await expect(searchInput).toBeVisible();

      await searchInput.fill('wcag');
      await searchInput.press('Enter');

      await expect(page).toHaveURL(/\/tutorial\/search\?q=wcag/);
    });
  });
});

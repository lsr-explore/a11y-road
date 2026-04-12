/**
 * Playwright-based manifest export script.
 *
 * Visits each page of the running demo site, collects all elements
 * (from data-a11y-name attributes) and break data (from the runtime
 * A11yExportBridge via window.__a11yManifest), then outputs a JSON
 * manifest to a file.
 *
 * Prerequisites:
 *   - NEXT_PUBLIC_ENABLE_MANIFEST_EXPORT=true in .env.local
 *   - Dev server running on localhost:3000 (or set BASE_URL env var)
 *
 * Usage:
 *   pnpm export:manifest
 *   MANIFEST_OUTPUT=custom-path.json pnpm export:manifest
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Page } from '@playwright/test';
import { test } from '@playwright/test';

// --- Types ---

interface ManifestRegisteredElement {
  instanceId: string;
  label: string;
}

interface ManifestResolvedInstance {
  instanceId: string;
  issueId: string;
  pageId: string;
  label: string;
}

interface A11yManifestData {
  registeredElements: ManifestRegisteredElement[];
  resolvedInstances: ManifestResolvedInstance[];
}

interface PageInteractionStep {
  action: 'click' | 'fill';
  selector: string;
  value?: string;
}

interface PageInteraction {
  state: string;
  steps: PageInteractionStep[];
}

interface PageConfig {
  id: string;
  name: string;
  route: string;
  interactions?: PageInteraction[];
}

interface DomElement {
  name: string;
  htmlTag: string;
}

interface ManifestElement {
  name: string;
  htmlTag: string;
  hasBreak: boolean;
  instanceId?: string;
  issueId?: string;
}

interface ManifestPageState {
  state: string;
  elements: ManifestElement[];
}

interface ManifestPage {
  id: string;
  name: string;
  route: string;
  states: ManifestPageState[];
}

interface ExportManifest {
  exportedAt: string;
  site: string;
  pages: ManifestPage[];
}

// --- Page configuration ---

const pageConfigs: PageConfig[] = [
  { id: 'landing', name: 'Landing Page', route: '/maple-valley-health' },
  {
    id: 'team',
    name: 'Team Page',
    route: '/maple-valley-health/team',
    interactions: [
      {
        state: 'after-delete-click',
        steps: [{ action: 'click', selector: '[data-a11y-name="Delete member button"]' }],
      },
    ],
  },
  {
    id: 'contact',
    name: 'Contact Page',
    route: '/maple-valley-health/contact',
    interactions: [
      {
        state: 'empty-submit',
        steps: [{ action: 'click', selector: '[data-a11y-name="Send message button"]' }],
      },
    ],
  },
];

const OUTPUT_FILE = process.env.MANIFEST_OUTPUT || 'manifest.json';

// Default to learner role — it sees all elements without forcing broken mode
const LOGIN_USERNAME = process.env.EXPORT_USERNAME || 'learner';
const LOGIN_PASSWORD = process.env.EXPORT_PASSWORD || 'learnA11y123';

// --- Helpers ---

const authenticate = async (page: Page): Promise<void> => {
  console.log('Authenticating...');
  await page.goto('/login', { waitUntil: 'networkidle' });
  await page.fill('#username', LOGIN_USERNAME);
  await page.fill('#password', LOGIN_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/maple-valley-health/**', { timeout: 10000 });
  console.log('Authenticated successfully.');
};

const collectElements = async (page: Page): Promise<DomElement[]> => {
  const raw = await page.evaluate(() => {
    const nodes = document.querySelectorAll('[data-a11y-name]');
    return Array.from(nodes).map((node) => ({
      name: node.getAttribute('data-a11y-name') ?? '',
      htmlTag: node.tagName.toLowerCase(),
    }));
  });

  // Deduplicate by name, keeping the first occurrence's tag
  const seen = new Set<string>();
  return raw.filter((element) => {
    if (!element.name || seen.has(element.name)) return false;
    seen.add(element.name);
    return true;
  });
};

const collectManifestData = async (page: Page): Promise<A11yManifestData | null> => {
  return page.evaluate(() => {
    if (typeof window.__a11yManifest === 'function') {
      return window.__a11yManifest();
    }
    return null;
  });
};

const executeInteractionStep = async (page: Page, step: PageInteractionStep): Promise<void> => {
  const locator = page.locator(step.selector).first();
  switch (step.action) {
    case 'click':
      await locator.click();
      break;
    case 'fill':
      await locator.fill(step.value ?? '');
      break;
  }
};

const buildElements = (
  domElements: DomElement[],
  manifestData: A11yManifestData | null,
  pageId: string,
): ManifestElement[] => {
  const pageInstances =
    manifestData?.resolvedInstances.filter((instance) => instance.pageId === pageId) ?? [];

  const registeredLabels = new Set(
    manifestData?.registeredElements.map((element) => element.label) ?? [],
  );

  return domElements.map(({ name, htmlTag }) => {
    const matchingInstance = pageInstances.find((instance) => instance.label === name);
    const isRegistered = registeredLabels.has(name);

    if (matchingInstance && isRegistered) {
      return {
        name,
        htmlTag,
        hasBreak: true,
        instanceId: matchingInstance.instanceId,
        issueId: matchingInstance.issueId,
      };
    }

    return { name, htmlTag, hasBreak: false };
  });
};

// --- Playwright test (used as a script runner) ---

test('export a11y manifest', async ({ page }) => {
  await authenticate(page);

  const manifest: ExportManifest = {
    exportedAt: new Date().toISOString(),
    site: 'maple-valley-health',
    pages: [],
  };

  for (const pageConfig of pageConfigs) {
    const url = pageConfig.route;
    console.log(`Visiting ${pageConfig.name} (${url})...`);

    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const bridgeAvailable = await page.evaluate(() => typeof window.__a11yManifest === 'function');

    if (!bridgeAvailable) {
      throw new Error(
        'window.__a11yManifest is not available. ' +
          'Ensure NEXT_PUBLIC_ENABLE_MANIFEST_EXPORT=true is set in .env.local',
      );
    }

    // Collect default state
    const defaultElements = await collectElements(page);
    const defaultManifest = await collectManifestData(page);
    const manifestPage: ManifestPage = {
      id: pageConfig.id,
      name: pageConfig.name,
      route: pageConfig.route,
      states: [
        {
          state: 'default',
          elements: buildElements(defaultElements, defaultManifest, pageConfig.id),
        },
      ],
    };

    // Collect interaction states
    if (pageConfig.interactions) {
      for (const interaction of pageConfig.interactions) {
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);

        for (const step of interaction.steps) {
          await executeInteractionStep(page, step);
        }

        await page.waitForTimeout(500);

        const stateElements = await collectElements(page);
        const stateManifest = await collectManifestData(page);

        const defaultNames = new Set(defaultElements.map((element) => element.name));
        const newElements = stateElements.filter((element) => !defaultNames.has(element.name));

        const changedElements = stateElements.filter((element) => {
          if (newElements.some((newEl) => newEl.name === element.name)) return false;
          const defaultElement = manifestPage.states[0].elements.find(
            (el) => el.name === element.name,
          );
          const currentBreak = buildElements([element], stateManifest, pageConfig.id)[0];
          return defaultElement?.hasBreak !== currentBreak.hasBreak;
        });

        const interactionElements = [...newElements, ...changedElements];

        if (interactionElements.length > 0) {
          manifestPage.states.push({
            state: interaction.state,
            elements: buildElements(interactionElements, stateManifest, pageConfig.id),
          });
        }
      }
    }

    manifest.pages.push(manifestPage);
  }

  const output = JSON.stringify(manifest, null, 2);
  const outputPath = resolve(OUTPUT_FILE);
  writeFileSync(outputPath, output, 'utf-8');
  console.log(`\nManifest written to ${outputPath}`);
  console.log(`Pages: ${manifest.pages.length}`);
  for (const manifestPage of manifest.pages) {
    const elementCount = manifestPage.states[0].elements.length;
    const breakCount = manifestPage.states[0].elements.filter((element) => element.hasBreak).length;
    console.log(`  ${manifestPage.name}: ${elementCount} elements, ${breakCount} breaks`);
  }
});

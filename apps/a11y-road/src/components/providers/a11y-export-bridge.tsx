'use client';

import { useElementRegistry } from '@a11y-road/a11y-kit';
import { useEffect } from 'react';
import { registry } from '@/data/issues-registry';

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

export interface A11yManifestData {
  registeredElements: ManifestRegisteredElement[];
  resolvedInstances: ManifestResolvedInstance[];
}

declare global {
  interface Window {
    __a11yManifest?: () => A11yManifestData;
  }
}

/**
 * Bridges React context (ElementRegistry) and the static A11yRegistry
 * to a globally callable function for Playwright-based manifest export.
 *
 * Only mount when NEXT_PUBLIC_ENABLE_MANIFEST_EXPORT is "true".
 * The function lives in JS memory — it is not visible in DOM inspection.
 */
export const A11yExportBridge = () => {
  const { getAllElements } = useElementRegistry();

  useEffect(() => {
    window.__a11yManifest = () => {
      const elements = getAllElements();
      const resolved = registry.getAllResolved();

      return {
        registeredElements: elements.map((element) => ({
          instanceId: element.instanceId,
          label: element.label,
        })),
        resolvedInstances: resolved.map((item) => ({
          instanceId: item.instance.id,
          issueId: item.instance.issueId,
          pageId: item.instance.pageId,
          label: item.instance.label,
        })),
      };
    };

    return () => {
      delete window.__a11yManifest;
    };
  }, [getAllElements]);

  return null;
};

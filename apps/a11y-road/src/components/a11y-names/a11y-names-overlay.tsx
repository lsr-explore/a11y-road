'use client';

import { useEffect } from 'react';
import { useA11yNames } from '../providers/a11y-names-provider';

const LABEL_MARKER = 'data-a11y-name-label';
const ACTIVE_CLASS = 'show-a11y-names';
const TAG_ATTR = 'data-a11y-name';

const formatLabel = (element: Element): string => {
  const tag = element.tagName.toLowerCase();
  const name = element.getAttribute(TAG_ATTR) ?? '';
  return `${tag}: ${name}`;
};

const isLabelNode = (node: Node): boolean =>
  node instanceof Element && node.hasAttribute(LABEL_MARKER);

const positionLabel = (label: HTMLElement, element: Element) => {
  const rect = element.getBoundingClientRect();
  label.style.top = `${rect.bottom + window.scrollY + 4}px`;
  label.style.left = `${rect.left + window.scrollX}px`;
};

const syncLabels = () => {
  const tagged = document.querySelectorAll<HTMLElement>(`[${TAG_ATTR}]`);
  const orphaned = new Set<Element>(document.querySelectorAll(`[${LABEL_MARKER}]`));

  tagged.forEach((element) => {
    if (!element.getAttribute(TAG_ATTR)) return;

    const expectedText = formatLabel(element);
    const next = element.nextElementSibling;
    let label: HTMLElement;

    if (next?.hasAttribute(LABEL_MARKER)) {
      label = next as HTMLElement;
      if (label.textContent !== expectedText) {
        label.textContent = expectedText;
      }
      orphaned.delete(label);
    } else {
      label = document.createElement('span');
      label.setAttribute(LABEL_MARKER, '');
      label.className = 'a11y-name-label';
      label.textContent = expectedText;
      element.insertAdjacentElement('afterend', label);
    }

    positionLabel(label, element);
  });

  orphaned.forEach((node) => {
    node.remove();
  });
};

const clearLabels = () => {
  document.querySelectorAll(`[${LABEL_MARKER}]`).forEach((node) => {
    node.remove();
  });
};

const mutationsAreSelfTriggered = (mutations: MutationRecord[]): boolean =>
  mutations.every((mutation) => {
    const addedAreLabels =
      mutation.addedNodes.length === 0 || Array.from(mutation.addedNodes).every(isLabelNode);
    const removedAreLabels =
      mutation.removedNodes.length === 0 || Array.from(mutation.removedNodes).every(isLabelNode);
    const targetIsLabel =
      mutation.type === 'characterData' &&
      mutation.target.parentElement !== null &&
      mutation.target.parentElement.hasAttribute(LABEL_MARKER);
    return (addedAreLabels && removedAreLabels) || targetIsLabel;
  });

export const A11yNamesOverlay = () => {
  const { isOn } = useA11yNames();

  useEffect(() => {
    if (!isOn) return;

    document.documentElement.classList.add(ACTIVE_CLASS);
    syncLabels();

    let scheduled = false;
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      queueMicrotask(() => {
        scheduled = false;
        syncLabels();
      });
    };

    const observer = new MutationObserver((mutations) => {
      if (mutationsAreSelfTriggered(mutations)) return;
      schedule();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [TAG_ATTR],
    });

    const handleResize = () => schedule();
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      document.documentElement.classList.remove(ACTIVE_CLASS);
      clearLabels();
    };
  }, [isOn]);

  return null;
};

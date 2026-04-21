'use client';

import { useEffect } from 'react';
import { useA11yNames } from '../providers/a11y-names-provider';

const LABEL_MARKER = 'data-a11y-name-label';
const ABSOLUTE_MARKER = 'data-a11y-label-absolute';
const ACTIVE_CLASS = 'show-a11y-names';
const TAG_ATTR = 'data-a11y-name';
const INLINE_DISPLAYS = new Set(['inline', 'inline-block', 'inline-flex', 'inline-grid']);
const FLEX_DISPLAYS = new Set(['flex', 'inline-flex']);

const formatLabel = (element: Element): string => {
  const tag = element.tagName.toLowerCase();
  const name = element.getAttribute(TAG_ATTR) ?? '';
  return `${tag}: ${name}`;
};

const isLabelNode = (node: Node): boolean =>
  node instanceof Element && node.hasAttribute(LABEL_MARKER);

const findPositionedAncestor = (element: Element): Element | null => {
  let parent = element.parentElement;
  while (parent) {
    const position = window.getComputedStyle(parent).position;
    if (position !== 'static') return parent;
    parent = parent.parentElement;
  }
  return null;
};

const shouldUseAbsolutePosition = (element: Element): boolean => {
  if (typeof window === 'undefined') return false;
  const elementStyle = window.getComputedStyle(element);
  if (INLINE_DISPLAYS.has(elementStyle.display)) return true;
  const parent = element.parentElement;
  if (!parent) return false;
  const parentStyle = window.getComputedStyle(parent);
  return FLEX_DISPLAYS.has(parentStyle.display);
};

const positionLabel = (label: HTMLElement, element: Element) => {
  const useAbsolute = shouldUseAbsolutePosition(element);

  if (!useAbsolute) {
    label.removeAttribute(ABSOLUTE_MARKER);
    label.style.removeProperty('top');
    label.style.removeProperty('left');
    return;
  }

  label.setAttribute(ABSOLUTE_MARKER, '');
  const rect = element.getBoundingClientRect();
  const ancestor = findPositionedAncestor(label);
  if (ancestor) {
    const ancestorRect = ancestor.getBoundingClientRect();
    label.style.top = `${rect.bottom - ancestorRect.top + 4}px`;
    label.style.left = `${rect.left - ancestorRect.left}px`;
    return;
  }
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

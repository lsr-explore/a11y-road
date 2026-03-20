import type { RefObject } from 'react';

export const highlightElementByRef = (ref: RefObject<HTMLElement | null>, durationMs = 3000) => {
  const element = ref.current;
  if (!element) return;
  applyHighlight(element, durationMs);
};

export const highlightElement = (selector: string, durationMs = 3000) => {
  const element = document.querySelector(selector);
  if (!element) return;
  applyHighlight(element as HTMLElement, durationMs);
};

const applyHighlight = (element: HTMLElement, durationMs: number) => {
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });

  element.style.outline = '3px solid #ef4444';
  element.style.outlineOffset = '2px';
  element.style.transition = 'outline 0.2s ease';
  element.classList.add('a11y-highlight-pulse');

  setTimeout(() => {
    element.style.outline = '';
    element.style.outlineOffset = '';
    element.classList.remove('a11y-highlight-pulse');
  }, durationMs);
};

export const highlightCss = `
@keyframes a11y-pulse {
  0%, 100% { outline-color: #ef4444; }
  50% { outline-color: #fbbf24; }
}
.a11y-highlight-pulse {
  animation: a11y-pulse 0.6s ease-in-out infinite;
}
`;

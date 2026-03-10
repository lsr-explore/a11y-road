export function highlightElement(selector: string, durationMs = 3000) {
  const el = document.querySelector(selector);
  if (!el) return;

  el.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const htmlEl = el as HTMLElement;
  htmlEl.style.outline = '3px solid #ef4444';
  htmlEl.style.outlineOffset = '2px';
  htmlEl.style.transition = 'outline 0.2s ease';
  htmlEl.classList.add('a11y-highlight-pulse');

  setTimeout(() => {
    htmlEl.style.outline = '';
    htmlEl.style.outlineOffset = '';
    htmlEl.classList.remove('a11y-highlight-pulse');
  }, durationMs);
}

export const highlightCss = `
@keyframes a11y-pulse {
  0%, 100% { outline-color: #ef4444; }
  50% { outline-color: #fbbf24; }
}
.a11y-highlight-pulse {
  animation: a11y-pulse 0.6s ease-in-out infinite;
}
`;

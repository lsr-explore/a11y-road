---
paths:
  - "src/examples/inaccessible/**/*.{ts,tsx,js,jsx}"
  - "src/demos/broken/**/*.{ts,tsx,js,jsx}"
---

# Accessibility demo override

This project includes intentionally inaccessible examples for teaching and comparison.

- Preserve intentional accessibility violations in these files unless the user explicitly asks to fix them.
- Do not automatically apply WCAG or ARIA fixes in these demo files.
- Keep the contrast between broken and fixed examples clear.
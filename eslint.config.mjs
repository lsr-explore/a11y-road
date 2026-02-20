// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
  },
  {
    ignores: ["build/", ".docusaurus/", "node_modules/"],
  },
  {
    rules: {
      // Disable jsx-a11y rules already covered by Biome's a11y group.
      // Biome equivalents are listed as comments.
      "jsx-a11y/alt-text": "off", // biome: a11y/useAltText
      "jsx-a11y/anchor-has-content": "off", // biome: a11y/useAnchorContent
      "jsx-a11y/anchor-is-valid": "off", // biome: a11y/useValidAnchor
      "jsx-a11y/aria-activedescendant-has-tabindex": "off", // biome: a11y/useAriaActivedescendantWithTabindex
      "jsx-a11y/aria-props": "off", // biome: a11y/useValidAriaProps
      "jsx-a11y/aria-proptypes": "off", // biome: a11y/useValidAriaValues
      "jsx-a11y/aria-role": "off", // biome: a11y/useValidAriaRole
      "jsx-a11y/aria-unsupported-elements": "off", // biome: a11y/noAriaUnsupportedOnRole
      "jsx-a11y/heading-has-content": "off", // biome: a11y/useHeadingContent
      "jsx-a11y/html-has-lang": "off", // biome: a11y/useHtmlLang
      "jsx-a11y/iframe-has-title": "off", // biome: a11y/useIframeTitle
      "jsx-a11y/img-redundant-alt": "off", // biome: a11y/noRedundantAlt
      "jsx-a11y/media-has-caption": "off", // biome: a11y/useMediaCaption
      "jsx-a11y/no-access-key": "off", // biome: a11y/noAccessKey
      "jsx-a11y/no-aria-hidden-on-focusable": "off", // biome: a11y/noAriaHiddenOnFocusable
      "jsx-a11y/no-autofocus": "off", // biome: a11y/noAutofocus
      "jsx-a11y/no-distracting-elements": "off", // biome: a11y/noDistractingElements
      "jsx-a11y/no-interactive-element-to-noninteractive-role": "off", // biome: a11y/noInteractiveElementToNoninteractiveRole
      "jsx-a11y/no-noninteractive-element-to-interactive-role": "off", // biome: a11y/noNoninteractiveElementToInteractiveRole
      "jsx-a11y/no-noninteractive-tabindex": "off", // biome: a11y/noNoninteractiveTabindex
      "jsx-a11y/no-redundant-roles": "off", // biome: a11y/noRedundantRoles
      "jsx-a11y/role-has-required-aria-props": "off", // biome: a11y/useAriaPropsForRole
      "jsx-a11y/scope": "off", // biome: a11y/noHeaderScope
      "jsx-a11y/tabindex-no-positive": "off", // biome: a11y/noPositiveTabindex

      // These jsx-a11y rules are NOT covered by Biome — keep them enabled:
      // jsx-a11y/click-events-have-key-events
      // jsx-a11y/interactive-supports-focus
      // jsx-a11y/label-has-associated-control
      // jsx-a11y/mouse-events-have-key-events
      // jsx-a11y/no-noninteractive-element-interactions
      // jsx-a11y/no-static-element-interactions
    },
  },
  storybook.configs["flat/recommended"]
);

# Localization Guide

This document describes how localization (i18n) is set up in this Docusaurus site and the steps needed to fully support a new language.

## How It Works

Docusaurus i18n uses a file-based approach. Each locale gets its own directory under `i18n/<locale>/` containing:

- **JSON translation files** — UI strings for the theme, navbar, footer, sidebar labels, and plugin options.
- **Translated doc content** — full copies of Markdown/MDX files from `docs/`, placed under `i18n/<locale>/docusaurus-plugin-content-docs/current/`.
- **Translated blog content** — full copies of blog posts, placed under `i18n/<locale>/docusaurus-plugin-content-blog/`.

The default locale (`en`) serves content directly from `docs/` and `blog/`. Non-default locales serve from their `i18n/<locale>/` directories.

## Current Setup

- **Default locale:** `en`
- **Additional locales:** `es` (Spanish, placeholder content)
- **Locale dropdown:** Added to the navbar (right side), visible when multiple locales exist.

## Directory Structure

```
i18n/
├── en/                                          # English (default)
│   ├── code.json                                # Theme UI strings
│   ├── docusaurus-theme-classic/
│   │   ├── navbar.json                          # Navbar labels
│   │   └── footer.json                          # Footer labels
│   ├── docusaurus-plugin-content-docs/
│   │   └── current.json                         # Sidebar labels
│   └── docusaurus-plugin-content-blog/
│       └── options.json                         # Blog plugin labels
├── es/                                          # Spanish
│   ├── code.json                                # Theme UI strings (needs translation)
│   ├── docusaurus-theme-classic/
│   │   ├── navbar.json                          # Translated navbar labels
│   │   └── footer.json                          # Translated footer labels
│   ├── docusaurus-plugin-content-docs/
│   │   ├── current.json                         # Translated sidebar labels
│   │   └── current/                             # Translated doc pages
│   │       ├── intro.md
│   │       ├── tutorial-basics/
│   │       │   ├── congratulations.md
│   │       │   ├── create-a-blog-post.md
│   │       │   ├── create-a-document.md
│   │       │   ├── create-a-page.md
│   │       │   ├── deploy-your-site.md
│   │       │   └── markdown-features.mdx
│   │       └── tutorial-extras/
│   │           ├── manage-docs-versions.md
│   │           └── translate-your-site.md
│   └── docusaurus-plugin-content-blog/
│       └── options.json                         # Translated blog labels
```

## Adding a New Language

Follow these steps to add support for a new locale (e.g., French `fr`):

### 1. Update `docusaurus.config.ts`

Add the locale to the `i18n` config:

```ts
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'es', 'fr'],  // add 'fr'
  localeConfigs: {
    en: { label: 'English', direction: 'ltr', htmlLang: 'en-US' },
    es: { label: 'Español', direction: 'ltr', htmlLang: 'es' },
    fr: { label: 'Français', direction: 'ltr', htmlLang: 'fr' },  // add config
  },
},
```

For RTL languages (e.g., Arabic), set `direction: 'rtl'`.

### 2. Generate translation JSON files

Run the Docusaurus CLI to scaffold the JSON translation files:

```bash
pnpm docusaurus write-translations --locale fr
```

This creates `i18n/fr/code.json` and the plugin/theme JSON files with the default English values. You then translate the `"message"` values in each file.

### 3. Translate the JSON files

Edit each JSON file under `i18n/fr/` and replace the English `"message"` values with French translations. Key files:

| File | Contains |
|------|----------|
| `code.json` | All theme UI strings (buttons, labels, ARIA text, pagination, etc.) |
| `docusaurus-theme-classic/navbar.json` | Navbar item labels |
| `docusaurus-theme-classic/footer.json` | Footer column titles and link labels |
| `docusaurus-plugin-content-docs/current.json` | Sidebar category labels |
| `docusaurus-plugin-content-blog/options.json` | Blog title, description, sidebar label |

### 4. Copy and translate doc content

Create the translated docs directory and copy the English docs into it:

```bash
mkdir -p i18n/fr/docusaurus-plugin-content-docs/current
cp -r docs/* i18n/fr/docusaurus-plugin-content-docs/current/
```

Then translate each Markdown/MDX file. Keep the same filenames and frontmatter structure (`sidebar_position`, etc.).

### 5. Copy and translate blog content (optional)

If you want translated blog posts:

```bash
mkdir -p i18n/fr/docusaurus-plugin-content-blog
cp -r blog/* i18n/fr/docusaurus-plugin-content-blog/
```

Then translate each blog post. Keep the same filenames.

### 6. Test the locale

Start the dev server for the new locale:

```bash
pnpm start -- --locale fr
```

This builds and serves only the French version locally. Verify:

- The locale dropdown appears and shows "Français"
- Navbar, footer, and sidebar labels are translated
- Doc pages render the translated content
- Blog pages render translated content (if applicable)

### 7. Build all locales

A production build compiles all locales:

```bash
pnpm build
```

Each locale is served under its own path prefix (e.g., `/fr/`). The default locale (`en`) is served at the root `/`.

## Translating Blog Posts

Blog post translation works by placing translated copies under `i18n/<locale>/docusaurus-plugin-content-blog/`. Docusaurus matches translated posts to originals by file path.

### Directory mapping

Given this English blog structure:

```
blog/
├── authors.yml
├── tags.yml
├── 2024-01-15-my-post.md
└── 2024-02-10-another-post/
    ├── index.md
    └── img/screenshot.png
```

The Spanish translations go here:

```
i18n/es/docusaurus-plugin-content-blog/
├── authors.yml                          # optional — translate author bios
├── 2024-01-15-my-post.md
└── 2024-02-10-another-post/
    ├── index.md
    └── img/screenshot.png               # reuse or provide localized images
```

### Quick setup

```bash
mkdir -p i18n/<locale>/docusaurus-plugin-content-blog
cp -r blog/* i18n/<locale>/docusaurus-plugin-content-blog/
# then translate the Markdown content in each copied file
```

### Important details

- **Same filenames required** — Docusaurus matches posts by file path, so translated files must have identical names to their English counterparts.
- **Same frontmatter structure** — keep `slug`, `date`, `authors`, and `tags` the same. Translate `title` and `description`.
- **`tags.yml` does not need to be copied** — tags are matched by key, not label. Translated tag labels go in `i18n/<locale>/docusaurus-plugin-content-blog/options.json` (already scaffolded).
- **`authors.yml`** — copy only if you want to translate author bios. Otherwise the English version is used as fallback.
- **Images** — reuse the same images, or provide localized versions at the same relative path within the locale directory.
- **No automatic fallback for posts** — if a blog post file doesn't exist in the locale directory, it won't appear in that locale's blog at all. Create at least a placeholder for every post you want visible.

### Testing

```bash
pnpm start -- --locale es
```

Navigate to `/es/blog` to verify translated posts appear correctly.

## Translating React Components

Hardcoded strings in React components (under `src/`) must be wrapped with Docusaurus i18n APIs so they appear in `code.json` and can be translated per locale.

### `<Translate>` component (for JSX content)

Use for inline text that renders as a React node:

```tsx
import Translate from '@docusaurus/Translate';

<p>
  <Translate id="homepage.tagline" description="The homepage tagline">
    Accessibility Across the Product Lifecycle
  </Translate>
</p>
```

### `translate()` function (for string attributes)

Use for props that expect a plain string (e.g., `title`, `aria-label`, `placeholder`):

```tsx
import { translate } from '@docusaurus/Translate';

<Layout
  title={translate({
    id: 'homepage.title',
    message: 'Hello from {title}',
    description: 'The homepage title head tag',
  }).replace('{title}', siteConfig.title)}
/>
```

### Conventions

- Use a dotted `id` namespace: `homepage.features.easyToUse.title`
- The `message` is the default (English) text and also serves as the fallback
- The `description` helps translators understand context — keep it short
- After adding new `<Translate>` or `translate()` calls, run `pnpm docusaurus write-translations --locale <locale>` to generate the new keys in `code.json`
- The children of `<Translate>` must be a plain string literal (no JSX expressions)

### Currently translated components

| Component | File | Translatable strings |
|-----------|------|---------------------|
| `HomepageHeader` | `src/pages/index.tsx` | Tagline, CTA button, page title, meta description |
| `HomepageFeatures` | `src/components/HomepageFeatures/index.tsx` | 3 feature titles + 3 feature descriptions |

## Translating `code.json`

The `code.json` file contains ~92 UI strings (82 theme strings + 10 custom component strings). These include hardcoded theme strings (search placeholder, "Read more", pagination labels, etc.) and custom strings from React components wrapped with `<Translate>` or `translate()`. The `"description"` field explains what each string is for — do not translate the descriptions, only the `"message"` values.

## Keeping Translations in Sync

When you add new docs, blog posts, or change sidebar/navbar labels:

1. Run `pnpm docusaurus write-translations --locale <locale>` again to pick up new keys (existing translations are preserved).
2. Copy new doc/blog files to each locale's content directory.
3. Translate the new content.

## CI Considerations

- The `pnpm build` command builds all locales. Build time scales linearly with the number of locales.
- Consider running `pnpm build --locale en` in CI for faster checks if full locale builds aren't needed on every PR.
- Untranslated content in non-default locales will fall back to the default locale's content for JSON strings, but doc/blog pages must exist (even as placeholders) to avoid broken links.

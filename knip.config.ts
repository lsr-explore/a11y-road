import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  rules: {
    // These exports are part of the data layer API — kept for future use
    exports: 'off',
    types: 'off',
    // vitest setupFiles string refs report as unresolved
    unresolved: 'off',
  },
  workspaces: {
    'apps/a11y-road': {
      entry: [
        'src/app/**/page.tsx',
        'src/app/**/page.mdx',
        'src/app/**/layout.tsx',
        'src/app/**/route.ts',
        'src/test-setup.ts',
      ],
      project: ['src/**/*.{ts,tsx}'],
      ignore: ['src/data/a11y-issues.ts'],
      ignoreDependencies: [
        '@a11y-road/a11y-kit',
        '@a11y-road/a11y-ui',
        // Virtual module provided by @mdx-js/react
        'mdx',
      ],
    },
    'apps/maple-valley-health-e2e': {
      entry: ['src/**/*.spec.ts'],
      project: ['src/**/*.ts'],
    },
    'libs/a11y-kit': {
      entry: ['src/test-setup.ts'],
      project: ['src/**/*.{ts,tsx}'],
      ignoreDependencies: [],
    },
  },
  ignoreBinaries: [
    // globally installed binaries used in scripts
    'pandoc',
    'vercel',
    'dot',
    'tree',
  ],
  ignoreDependencies: [
    // Nx plugins used implicitly via nx.json
    '@nx/*',
    '@swc/*',
    // ESLint plugins loaded via flat config
    'eslint-plugin-import',
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
    'typescript-eslint',
    '@eslint/js',
  ],
};

export default config;

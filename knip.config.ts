import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  rules: {
    // These exports are part of the data layer API — kept for future use
    exports: 'warn',
    types: 'warn',
    // vitest setupFiles string refs report as unresolved
    unresolved: 'warn',
  },
  workspaces: {
    'apps/maple-valley-health': {
      entry: [
        'src/app/**/page.tsx',
        'src/app/**/layout.tsx',
        'src/app/**/route.ts',
        'src/test-setup.ts',
      ],
      project: ['src/**/*.{ts,tsx}'],
      ignore: ['src/data/a11y-issues.ts'],
      ignoreDependencies: [
        'jsdom',
        '@maple-valley-health/a11y-kit',
      ],
    },
    'apps/maple-valley-health-e2e': {
      entry: ['src/**/*.spec.ts'],
      project: ['src/**/*.ts'],
    },
    'libs/a11y-kit': {
      project: ['src/**/*.{ts,tsx}'],
    },
  },
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

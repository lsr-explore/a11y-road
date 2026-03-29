import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/nextjs-vite';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

const rootDir = dirname(fileURLToPath(import.meta.url)).replace('/.storybook', '');
const appDir = join(rootDir, 'apps/a11y-road');

const config: StorybookConfig = {
  stories: ['../apps/a11y-road/src/**/*.stories.@(ts|tsx)', '../libs/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: '@storybook/nextjs-vite',
  staticDirs: ['../apps/a11y-road/public'],
  viteFinal: async (viteConfig) => {
    viteConfig.css = {
      ...viteConfig.css,
      postcss: {
        plugins: [
          tailwindcss({
            config: {
              darkMode: ['class'],
              content: [
                join(appDir, 'src/**/*.{ts,tsx,js,jsx,md,mdx,html}'),
                join(rootDir, 'libs/a11y-kit/src/**/*.{ts,tsx}'),
                join(rootDir, 'libs/a11y-ui/src/**/*.{ts,tsx}'),
              ],
              theme: {
                extend: {
                  colors: {
                    background: 'hsl(var(--background))',
                    sidebar: {
                      DEFAULT: 'hsl(var(--sidebar-background))',
                      foreground: 'hsl(var(--sidebar-foreground))',
                      primary: 'hsl(var(--sidebar-primary))',
                      'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                      accent: 'hsl(var(--sidebar-accent))',
                      'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                      border: 'hsl(var(--sidebar-border))',
                      ring: 'hsl(var(--sidebar-ring))',
                    },
                  },
                },
              },
            },
          }),
          autoprefixer(),
        ],
      },
    };
    return viteConfig;
  },
};

export default config;

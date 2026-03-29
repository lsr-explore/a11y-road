import { A11yModeProvider, ElementRegistryProvider, useA11yMode } from '@a11y-road/a11y-kit';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useEffect } from 'react';
import { ContactForm } from './contact-form';

/** Toggles into accessible mode on mount so the story renders the fixed variant. */
const ForceAccessible = ({ children }: { children: React.ReactNode }) => {
  const { isAccessible, toggle } = useA11yMode();
  useEffect(() => {
    if (!isAccessible) toggle();
  }, [isAccessible, toggle]);
  return <>{children}</>;
};

const meta: Meta<typeof ContactForm> = {
  title: 'Demo/ContactForm',
  component: ContactForm,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof ContactForm>;

/**
 * The accessible version includes visible labels, focus indicators,
 * aria-describedby for error association, aria-invalid for invalid fields,
 * and role="alert" on error messages for screen reader announcements.
 */
export const Accessible: Story = {
  decorators: [
    (Story) => (
      <A11yModeProvider>
        <ElementRegistryProvider>
          <ForceAccessible>
            <div className="max-w-md mx-auto p-6">
              <Story />
            </div>
          </ForceAccessible>
        </ElementRegistryProvider>
      </A11yModeProvider>
    ),
  ],
};

/**
 * The inaccessible version replaces labels with placeholder text,
 * removes focus indicators (outline: none), omits aria-describedby
 * and aria-invalid, and error messages lack role="alert".
 *
 * Violations you should see in the a11y panel:
 * - Form elements without associated labels
 * - Missing visible focus indicators
 */
export const Inaccessible: Story = {
  decorators: [
    (Story) => (
      <A11yModeProvider forceBroken>
        <ElementRegistryProvider>
          <div className="max-w-md mx-auto p-6">
            <Story />
          </div>
        </ElementRegistryProvider>
      </A11yModeProvider>
    ),
  ],
};

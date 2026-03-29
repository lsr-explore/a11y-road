import { A11yModeProvider, ElementRegistryProvider, useA11yMode } from '@a11y-road/a11y-kit';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useEffect } from 'react';
import { TeamCard } from './team-card';

const sampleMember = {
  id: '1',
  name: 'Dr. Sarah Chen',
  role: 'physician',
  specialty: 'Internal Medicine',
  location: 'Seattle, WA',
  education: 'University of Washington School of Medicine',
  clinicalInterests: 'Preventive care, chronic disease management',
  personalInterests: 'Hiking, photography',
  photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop',
  onDelete: () => {},
};

const ForceAccessible = ({ children }: { children: React.ReactNode }) => {
  const { isAccessible, toggle } = useA11yMode();
  useEffect(() => {
    if (!isAccessible) toggle();
  }, [isAccessible, toggle]);
  return <>{children}</>;
};

const meta: Meta<typeof TeamCard> = {
  title: 'Demo/TeamCard',
  component: TeamCard,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof TeamCard>;

/**
 * The accessible version uses a semantic `<button>` with `aria-label="Delete Dr. Sarah Chen"`
 * for the icon-only delete action. Screen readers announce the button purpose, and it is
 * keyboard-focusable with a visible focus indicator.
 */
export const Accessible: Story = {
  args: sampleMember,
  decorators: [
    (Story) => (
      <A11yModeProvider>
        <ElementRegistryProvider>
          <ForceAccessible>
            <div className="max-w-sm">
              <Story />
            </div>
          </ForceAccessible>
        </ElementRegistryProvider>
      </A11yModeProvider>
    ),
  ],
};

/**
 * The inaccessible version uses a `<div>` with `onClick` for the delete action.
 * It has no role, no accessible name, no keyboard support, and no focus indicator.
 *
 * axe-core violations you should see:
 * - **no interactive role**: clickable `<div>` is not recognized as a control
 * - **missing accessible name**: the icon-only element has no text or aria-label
 * - **no keyboard support**: cannot be reached or activated via keyboard
 */
export const Inaccessible: Story = {
  args: sampleMember,
  decorators: [
    (Story) => (
      <A11yModeProvider forceBroken>
        <ElementRegistryProvider>
          <div className="max-w-sm">
            <Story />
          </div>
        </ElementRegistryProvider>
      </A11yModeProvider>
    ),
  ],
};

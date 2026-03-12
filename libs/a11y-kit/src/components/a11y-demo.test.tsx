import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { A11yDemo } from './a11y-demo';
import { A11yModeProvider } from './a11y-mode-provider';

const renderWithProvider = (ui: React.ReactElement) =>
  render(<A11yModeProvider>{ui}</A11yModeProvider>);

describe('A11yDemo', () => {
  it('renders broken content by default', () => {
    renderWithProvider(
      <A11yDemo
        instanceId="test-toggle"
        broken={<span>broken version</span>}
        fixed={<span>fixed version</span>}
      />,
    );

    expect(screen.getByText('broken version')).toBeInTheDocument();
    expect(screen.queryByText('fixed version')).not.toBeInTheDocument();
  });

  it('renders children in wrapper mode', () => {
    renderWithProvider(
      <A11yDemo instanceId="test-wrapper">
        <span>wrapped content</span>
      </A11yDemo>,
    );

    expect(screen.getByText('wrapped content')).toBeInTheDocument();
  });

  it('sets data-a11y-id attribute', () => {
    const { container } = renderWithProvider(
      <A11yDemo instanceId="hero-alt">
        <span>content</span>
      </A11yDemo>,
    );

    expect(container.querySelector('[data-a11y-id="hero-alt"]')).toBeInTheDocument();
  });
});

import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { A11yDemo } from './a11y-demo';
import { A11yModeProvider } from './a11y-mode-provider';
import { ElementRegistryProvider, useElementRegistry } from './element-registry-provider';

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <A11yModeProvider>
      <ElementRegistryProvider>{ui}</ElementRegistryProvider>
    </A11yModeProvider>,
  );

describe('A11yDemo', () => {
  it('renders broken content by default', () => {
    renderWithProviders(
      <A11yDemo
        instanceId="test-toggle"
        label="Test element"
        broken={<span>broken version</span>}
        fixed={<span>fixed version</span>}
      />,
    );

    expect(screen.getByText('broken version')).toBeInTheDocument();
    expect(screen.queryByText('fixed version')).not.toBeInTheDocument();
  });

  it('renders children in wrapper mode', () => {
    renderWithProviders(
      <A11yDemo instanceId="test-wrapper" label="Test wrapper">
        <span>wrapped content</span>
      </A11yDemo>,
    );

    expect(screen.getByText('wrapped content')).toBeInTheDocument();
  });

  it('does not render data-a11y-id attribute', () => {
    const { container } = renderWithProviders(
      <A11yDemo instanceId="hero-alt" label="Hero image">
        <span>content</span>
      </A11yDemo>,
    );

    expect(container.querySelector('[data-a11y-id]')).not.toBeInTheDocument();
  });

  it('registers element with the registry', async () => {
    let getAll: ReturnType<typeof useElementRegistry>['getAllElements'] = () => [];

    const RegistryReader = () => {
      const { getAllElements } = useElementRegistry();
      getAll = getAllElements;
      return null;
    };

    await act(async () => {
      render(
        <A11yModeProvider>
          <ElementRegistryProvider>
            <A11yDemo instanceId="test-registered" label="Test label">
              <span>content</span>
            </A11yDemo>
            <RegistryReader />
          </ElementRegistryProvider>
        </A11yModeProvider>,
      );
    });

    const registryElements = getAll();
    expect(registryElements).toHaveLength(1);
    expect(registryElements[0].instanceId).toBe('test-registered');
    expect(registryElements[0].label).toBe('Test label');
    expect(registryElements[0].ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

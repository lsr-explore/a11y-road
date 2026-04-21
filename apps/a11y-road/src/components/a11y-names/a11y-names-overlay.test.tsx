import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { A11yNamesProvider, useA11yNames } from '../providers/a11y-names-provider';
import { A11yNamesOverlay } from './a11y-names-overlay';

const flush = () =>
  act(async () => {
    await Promise.resolve();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

const ToggleButton = () => {
  const { toggle } = useA11yNames();
  return (
    <button type="button" onClick={toggle} data-testid="toggle">
      toggle
    </button>
  );
};

const Harness = ({ children }: { children: React.ReactNode }) => (
  <A11yNamesProvider>
    <A11yNamesOverlay />
    <ToggleButton />
    {children}
  </A11yNamesProvider>
);

describe('A11yNamesOverlay', () => {
  afterEach(() => {
    document.documentElement.classList.remove('show-a11y-names');
    document.querySelectorAll('[data-a11y-name-label]').forEach((node) => {
      node.remove();
    });
  });

  it('renders no labels when toggle is off', () => {
    render(
      <Harness>
        <h1 data-a11y-name="Hero heading">Your Health</h1>
      </Harness>,
    );

    expect(document.querySelectorAll('[data-a11y-name-label]')).toHaveLength(0);
    expect(document.documentElement.classList.contains('show-a11y-names')).toBe(false);
  });

  it('injects a label sibling with "tag: name" after each tagged element when toggled on', async () => {
    const { getByTestId } = render(
      <Harness>
        <h1 data-a11y-name="Hero heading">Your Health</h1>
        <p data-a11y-name="Hero description">Description</p>
      </Harness>,
    );

    await act(async () => {
      getByTestId('toggle').click();
    });

    const labels = document.querySelectorAll<HTMLElement>('[data-a11y-name-label]');
    expect(labels).toHaveLength(2);
    expect(labels[0].textContent).toBe('h1: Hero heading');
    expect(labels[1].textContent).toBe('p: Hero description');
    expect(document.documentElement.classList.contains('show-a11y-names')).toBe(true);
  });

  it('places each label immediately after its element for screen reader flow', async () => {
    const { getByTestId } = render(
      <Harness>
        <h1 data-a11y-name="Hero heading">Your Health</h1>
      </Harness>,
    );

    await act(async () => {
      getByTestId('toggle').click();
    });

    const heading = document.querySelector('h1');
    expect(heading?.nextElementSibling?.getAttribute('data-a11y-name-label')).toBe('');
  });

  it('removes labels and class when toggled off', async () => {
    const { getByTestId } = render(
      <Harness>
        <h1 data-a11y-name="Hero heading">Your Health</h1>
      </Harness>,
    );

    await act(async () => {
      getByTestId('toggle').click();
    });
    expect(document.querySelectorAll('[data-a11y-name-label]')).toHaveLength(1);

    await act(async () => {
      getByTestId('toggle').click();
    });

    expect(document.querySelectorAll('[data-a11y-name-label]')).toHaveLength(0);
    expect(document.documentElement.classList.contains('show-a11y-names')).toBe(false);
  });

  it('picks up newly-added tagged elements via MutationObserver', async () => {
    const { getByTestId } = render(
      <Harness>
        <div id="host" />
      </Harness>,
    );

    await act(async () => {
      getByTestId('toggle').click();
    });
    expect(document.querySelectorAll('[data-a11y-name-label]')).toHaveLength(0);

    const host = document.getElementById('host');
    await act(async () => {
      const newElement = document.createElement('button');
      newElement.setAttribute('data-a11y-name', 'Book button');
      newElement.textContent = 'Book';
      host?.appendChild(newElement);
    });

    await flush();

    const labels = document.querySelectorAll('[data-a11y-name-label]');
    expect(labels).toHaveLength(1);
    expect(labels[0].textContent).toBe('button: Book button');
  });

  it('deduplicates: does not add a second label when sync runs twice', async () => {
    const { getByTestId } = render(
      <Harness>
        <h1 data-a11y-name="Hero heading">Your Health</h1>
      </Harness>,
    );

    await act(async () => {
      getByTestId('toggle').click();
    });

    await act(async () => {
      const host = document.createElement('div');
      document.body.appendChild(host);
    });
    await flush();

    expect(document.querySelectorAll('[data-a11y-name-label]')).toHaveLength(1);
  });
});

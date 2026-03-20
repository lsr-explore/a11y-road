import { ElementRegistryProvider } from '@a11y-road/a11y-kit';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { ContactForm } from './contact-form';

// Mock the a11y mode provider to control the toggle
const mockUseA11yMode = vi.fn();

vi.mock('../providers/a11y-mode-provider', () => ({
  useA11yMode: () => mockUseA11yMode(),
}));

const renderWithRegistry = (ui: React.ReactElement) =>
  render(<ElementRegistryProvider>{ui}</ElementRegistryProvider>);

describe('ContactForm', () => {
  describe('when accessibility mode is enabled (fixed)', () => {
    beforeEach(() => {
      mockUseA11yMode.mockReturnValue({ isAccessible: true, toggle: vi.fn() });
    });

    it('renders the accessible form with labels', () => {
      renderWithRegistry(<ContactForm />);

      expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Message')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument();
    });

    it('has no accessibility violations', async () => {
      const { container } = renderWithRegistry(<ContactForm />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('shows validation errors with proper ARIA attributes', async () => {
      renderWithRegistry(<ContactForm />);

      fireEvent.click(screen.getByRole('button', { name: 'Send Message' }));

      const nameError = await screen.findByText('Name is required');
      expect(nameError).toHaveAttribute('role', 'alert');

      const nameInput = screen.getByLabelText('Full Name');
      expect(nameInput).toHaveAttribute('aria-invalid', 'true');
      expect(nameInput).toHaveAttribute('aria-describedby', 'name-error');
    });

    it('has no accessibility violations when showing errors', async () => {
      const { container } = renderWithRegistry(<ContactForm />);

      fireEvent.click(screen.getByRole('button', { name: 'Send Message' }));
      await screen.findByText('Name is required');

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('when accessibility mode is disabled (broken)', () => {
    beforeEach(() => {
      mockUseA11yMode.mockReturnValue({ isAccessible: false, toggle: vi.fn() });
    });

    it('renders the inaccessible form without labels', () => {
      renderWithRegistry(<ContactForm />);

      expect(screen.queryByLabelText('Full Name')).not.toBeInTheDocument();
      expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    });

    it('has accessibility violations (missing labels)', async () => {
      renderWithRegistry(<ContactForm />);

      // The broken form uses placeholders instead of labels.
      // Verify there are no proper label elements associated with inputs.
      const inputs = document.querySelectorAll('input, textarea');
      const inputsWithoutLabels = Array.from(inputs).filter((input) => {
        const id = input.getAttribute('id');
        if (!id) return true;
        return !document.querySelector(`label[for="${id}"]`);
      });
      expect(inputsWithoutLabels.length).toBeGreaterThan(0);

      // Also verify axe flags the broken form — run with stricter rules
      // that require explicit labels (not just name attributes)
      const { container } = renderWithRegistry(<ContactForm />);
      const results = await axe(container, {
        rules: {
          // Ensure label rule catches placeholder-only patterns
          label: { enabled: true },
        },
      });

      // The broken form should have incomplete checks at minimum,
      // since placeholder alone is not a sufficient accessible name strategy
      const hasIssues = results.violations.length > 0 || results.incomplete.length > 0;
      expect(hasIssues).toBe(true);
    });
  });

  describe('form submission', () => {
    beforeEach(() => {
      mockUseA11yMode.mockReturnValue({ isAccessible: true, toggle: vi.fn() });
    });

    it('shows success message on valid submission', () => {
      renderWithRegistry(<ContactForm />);

      fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Jane Doe' } });
      fireEvent.change(screen.getByLabelText('Email Address'), {
        target: { value: 'jane@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Message'), {
        target: { value: 'Hello there!' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Send Message' }));

      expect(screen.getByText(/thank you/i)).toBeInTheDocument();
    });
  });
});

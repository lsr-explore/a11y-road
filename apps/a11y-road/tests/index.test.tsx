import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('../src/lib/auth', () => ({
  getSessionUser: vi.fn().mockResolvedValue(null),
}));

describe('Page', () => {
  it('should render successfully', async () => {
    const Page = (await import('../src/app/page')).default;
    const resolvedPage = await Page();
    const { baseElement } = render(resolvedPage);
    expect(baseElement).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'A11y Road' })).toBeInTheDocument();
  });
});

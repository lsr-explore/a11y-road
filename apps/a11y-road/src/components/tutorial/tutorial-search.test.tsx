import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { TutorialSearch } from './tutorial-search';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('TutorialSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input and button', () => {
    render(<TutorialSearch />);

    expect(screen.getByLabelText('Search tutorial')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('renders a search landmark', () => {
    render(<TutorialSearch />);

    expect(screen.getByRole('search', { name: 'Tutorial search' })).toBeInTheDocument();
  });

  it('navigates to search page on submit', () => {
    render(<TutorialSearch />);

    const input = screen.getByLabelText('Search tutorial');
    fireEvent.change(input, { target: { value: 'aria labels' } });
    fireEvent.submit(screen.getByRole('search'));

    expect(mockPush).toHaveBeenCalledWith('/tutorial/search?q=aria%20labels');
  });

  it('does not navigate with empty query', () => {
    render(<TutorialSearch />);

    fireEvent.submit(screen.getByRole('search'));

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('trims whitespace from query', () => {
    render(<TutorialSearch />);

    const input = screen.getByLabelText('Search tutorial');
    fireEvent.change(input, { target: { value: '  keyboard  ' } });
    fireEvent.submit(screen.getByRole('search'));

    expect(mockPush).toHaveBeenCalledWith('/tutorial/search?q=keyboard');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TutorialSearch />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

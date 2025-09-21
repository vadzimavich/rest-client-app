import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('should render all links and the current year', () => {
    render(<Footer />);

    const myLink = screen.getByRole('link', { name: /andrei kaspiarovich/i });
    expect(myLink).toBeInTheDocument();
    expect(myLink).toHaveAttribute('href', 'https://github.com/vadzimavich');

    const nataliaLink = screen.getByRole('link', {
      name: /natalya merkulova/i,
    });
    expect(nataliaLink).toBeInTheDocument();
    expect(nataliaLink).toHaveAttribute('href', 'https://github.com/tffl');

    const rsLink = screen.getByRole('link', { name: /rs school/i });
    expect(rsLink).toBeInTheDocument();
    expect(rsLink).toHaveAttribute('href', 'https://rs.school/courses/reactjs');

    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(currentYear)).toBeInTheDocument();
  });
});

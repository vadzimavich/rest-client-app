import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test-utils/test-utils';
import Spinner from './Spinner';

describe('Spinner', () => {
  it('should render correctly', () => {
    render(<Spinner />);
    const spinnerElement = screen.getByTestId('spinner');
    expect(spinnerElement).toBeInTheDocument();
  });
});

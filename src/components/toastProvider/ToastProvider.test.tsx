import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test-utils/test-utils';
import ToastProvider from './ToastProvider';

vi.mock('react-hot-toast', () => ({
  Toaster: (props: Record<string, unknown>) => (
    <div data-testid="toaster-mock" {...props} />
  ),
}));

describe('ToastProvider', () => {
  it('should render the Toaster component with correct props', () => {
    render(<ToastProvider />);

    const toasterMock = screen.getByTestId('toaster-mock');
    expect(toasterMock).toBeInTheDocument();

    expect(toasterMock).toHaveAttribute('position', 'top-right');
  });
});

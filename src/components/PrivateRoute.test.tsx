import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PrivateRoute from './PrivateRoute';
import { useAuth } from '@/hooks/useAuth';
import type { User } from 'firebase/auth';

vi.mock('@/hooks/useAuth');
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('PrivateRoute', () => {
  it('should render children when user is authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { email: 'test@user.com' } as User,
      loading: false,
    });

    render(
      <PrivateRoute>
        <div>Protected Content</div>
      </PrivateRoute>
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should render nothing and redirect when user is not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, loading: false });

    const { container } = render(
      <PrivateRoute>
        <div>Protected Content</div>
      </PrivateRoute>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });
});

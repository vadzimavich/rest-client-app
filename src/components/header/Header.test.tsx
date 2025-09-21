import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import type { User } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import userEvent from '@testing-library/user-event';
import Header from './Header';

vi.mock('firebase/auth');
vi.mock('@/hooks/useAuth');
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('Header', () => {
  it('should render Sign In and Sign Up links when user is not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, loading: false });
    render(<Header />);
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  it('should render Welcome message and Sign Out button when user is authenticated', () => {
    const mockUser = {
      email: 'test@example.com',
    } as User;

    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
    });

    render(<Header />);
    expect(screen.getByText(/welcome, test@example.com/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign out/i })
    ).toBeInTheDocument();
  });

  it('should call signOut when the sign out button is clicked', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { email: 'test@example.com' } as User,
      loading: false,
    });
    render(<Header />);

    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    await userEvent.click(signOutButton);

    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it('should render loading state', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: true,
    });
    render(<Header />);

    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it('should change language when select is changed', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, loading: false });
    render(<Header />);

    const languageSelect = screen.getByRole('combobox');

    expect(languageSelect).toHaveValue('en');

    await userEvent.selectOptions(languageSelect, 'ru');

    expect(languageSelect).toHaveValue('ru');
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test-utils/test-utils';
import { useAuth } from '@/hooks/useAuth';
import type { User } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import userEvent from '@testing-library/user-event';
import { useLocale } from 'next-intl';
import * as customNavigation from '@/navigation';
import Header from './Header';

vi.mock('firebase/auth');
vi.mock('@/hooks/useAuth');
vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-intl')>();
  return { ...actual, useLocale: vi.fn() };
});

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLocale).mockReturnValue('en');
  });

  it('should render Sign In and Sign Up links when user is not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, loading: false });
    render(<Header />);
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  it('should render Welcome message and Sign Out button when user is authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { email: 'test@example.com' } as User,
      loading: false,
    });
    render(<Header />);
    expect(screen.getByText(/welcome, test/i)).toBeInTheDocument();
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
    vi.mocked(useAuth).mockReturnValue({ user: null, loading: true });
    render(<Header />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it('should render Sign In and Sign Up links when user is not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, loading: false });
    render(<Header />);
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  it('should render Welcome message and Sign Out button when user is authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { email: 'test@example.com' } as User,
      loading: false,
    });
    render(<Header />);
    expect(screen.getByText(/welcome, test/i)).toBeInTheDocument();
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
    vi.mocked(useAuth).mockReturnValue({ user: null, loading: true });
    render(<Header />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it('should change language when select is changed', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, loading: false });
    const { rerender } = render(<Header />);
    const languageSelect = screen.getByRole('combobox');
    expect(languageSelect).toHaveValue('en');
    await userEvent.selectOptions(languageSelect, 'ru');
    vi.mocked(useLocale).mockReturnValue('ru');
    rerender(<Header />);
    expect(languageSelect).toHaveValue('ru');
  });

  it('should correctly switch language on a nested route', async () => {
    const mockRouter = {
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
      refresh: vi.fn(),
    };
    const routerSpy = vi
      .spyOn(customNavigation, 'useRouter')
      .mockReturnValue(mockRouter);

    vi.mocked(useAuth).mockReturnValue({ user: null, loading: false });
    render(<Header />);
    const languageSelect = screen.getByRole('combobox');
    await userEvent.selectOptions(languageSelect, 'ru');
    expect(mockRouter.replace).toHaveBeenCalledTimes(1);
    expect(mockRouter.replace).toHaveBeenCalledWith('/', { locale: 'ru' });
    routerSpy.mockRestore();
  });

  it('should handle errors when signing out', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const signOutError = new Error('Sign out failed');
    vi.mocked(signOut).mockRejectedValue(signOutError);
    vi.mocked(useAuth).mockReturnValue({
      user: { email: 'test@example.com' } as User,
      loading: false,
    });
    render(<Header />);
    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    await userEvent.click(signOutButton);
    await vi.waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error signing out: ',
        signOutError
      );
    });
    consoleErrorSpy.mockRestore();
  });

  it('should handle errors when signing out', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const signOutError = new Error('Sign out failed');
    vi.mocked(signOut).mockRejectedValue(signOutError);

    vi.mocked(useAuth).mockReturnValue({
      user: { email: 'test@example.com' } as User,
      loading: false,
    });
    render(<Header />);

    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    await userEvent.click(signOutButton);

    await vi.waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error signing out: ',
        signOutError
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('should apply scrolled class on scroll', async () => {
    render(<Header />);
    const header = screen.getByRole('banner');

    expect(header).not.toHaveClass(/scrolled/);

    fireEvent.scroll(window, { target: { scrollY: 100 } });

    await waitFor(() => {
      expect(header).toHaveClass(/scrolled/);
    });

    fireEvent.scroll(window, { target: { scrollY: 0 } });

    await waitFor(() => {
      expect(header).not.toHaveClass(/scrolled/);
    });
  });
});

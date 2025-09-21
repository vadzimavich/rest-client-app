import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test-utils/test-utils';
import userEvent from '@testing-library/user-event';
import AuthForm from './AuthForm';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock('firebase/auth');

describe('AuthForm', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'success' }),
      } as Response)
    );
    const mockUserCredential = {
      user: { getIdToken: () => Promise.resolve('fake-token') },
    } as UserCredential;
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue(
      mockUserCredential
    );
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue(mockUserCredential);
  });

  it('should render the sign-in form correctly', () => {
    render(<AuthForm mode="signin" />);
    expect(
      screen.getByRole('heading', { name: /sign in/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it('should render the sign-up form correctly', () => {
    render(<AuthForm mode="signup" />);
    expect(
      screen.getByRole('heading', { name: /sign up/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign up/i })
    ).toBeInTheDocument();
  });

  it('should display a validation error for a weak password on sign-up', async () => {
    render(<AuthForm mode="signup" />);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const form = screen
      .getByRole('heading', { name: /sign up/i })
      .closest('form');

    await user.type(passwordInput, 'weak');

    fireEvent.submit(form!);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/password must be at least 8 characters/i);
  });

  it('should display an error message on failed sign-in', async () => {
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue(
      new Error('Firebase: Error (auth/invalid-credential).')
    );

    render(<AuthForm mode="signin" />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const form = screen
      .getByRole('heading', { name: /sign in/i })
      .closest('form');

    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, 'password123');

    fireEvent.submit(form!);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/invalid-credential/i);
  });
});

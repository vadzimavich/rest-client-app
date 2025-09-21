import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthForm from './AuthForm';

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),

  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('AuthForm', () => {
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

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    await fireEvent.change(emailInput, {
      target: { value: 'test@example.com' },
    });
    await fireEvent.change(passwordInput, { target: { value: 'weak' } });
    await fireEvent.click(submitButton);

    const errorMessage = await screen.findByText(
      /password must be at least 8 characters/i
    );
    expect(errorMessage).toBeInTheDocument();
  });
});

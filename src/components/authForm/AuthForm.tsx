'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

import styles from './AuthForm.module.css';

type AuthMode = 'signin' | 'signup';

interface AuthFormProps {
  mode: AuthMode;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const title = mode === 'signin' ? 'Sign In' : 'Sign Up';
  const buttonText = mode === 'signin' ? 'Sign In' : 'Sign Up';

  const validatePassword = (password: string): boolean => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
      if (!validatePassword(password)) {
        setError(
          'Password must be at least 8 characters long and contain one letter, one number, and one special character.'
        );
        return;
      }
    }

    try {
      const userCredential =
        mode === 'signin'
          ? await signInWithEmailAndPassword(auth, email, password)
          : await createUserWithEmailAndPassword(auth, email, password);

      const idToken = await userCredential.user.getIdToken();

      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      router.push('/');
    } catch (err: unknown) {
      let friendlyMessage = 'An unexpected error occurred.';
      if (err instanceof Error) {
        friendlyMessage = err.message
          .replace('Firebase: Error ', '')
          .replace(/\(auth\/.*\)\.?/, '');
      }
      setError(friendlyMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>{title}</h2>

      <input
        className={styles.input}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />

      <input
        className={styles.input}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />

      <button type="submit" className={styles.button}>
        {buttonText}
      </button>

      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}

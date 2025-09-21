import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('@/lib/firebase/config', () => ({
  auth: {},
}));

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  getAuth: vi.fn(() => ({})),
}));

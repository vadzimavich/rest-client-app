import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test-utils/test-utils';
import userEvent from '@testing-library/user-event';
import VariablesPage from './page';
import { useAuth } from '@/hooks/useAuth';
import type { User } from 'firebase/auth';

vi.mock('@/hooks/useAuth');
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('VariablesPage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    localStorage.clear();
    vi.mocked(useAuth).mockReturnValue({
      user: { email: 'test@user.com' } as User,
      loading: false,
    });
  });

  it('should render the title and input fields', () => {
    render(<VariablesPage />);
    expect(
      screen.getByRole('heading', { name: /variables/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/key/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/value/i)).toBeInTheDocument();
  });

  it('should add a new variable and save it to localStorage', async () => {
    render(<VariablesPage />);
    const keyInput = screen.getByPlaceholderText(/key/i);
    const valueInput = screen.getByPlaceholderText(/value/i);
    const addButton = screen.getByLabelText(/add variable/i);

    await user.type(keyInput, 'baseURL');
    await user.type(valueInput, 'https://api.example.com');
    await user.click(addButton);

    expect(screen.getByDisplayValue('baseURL')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('https://api.example.com')
    ).toBeInTheDocument();

    const storedData = JSON.parse(
      localStorage.getItem('rest-client-variables') || '[]'
    );
    expect(storedData).toHaveLength(1);
    expect(storedData[0].key).toBe('baseURL');
  });

  it('should delete a variable', async () => {
    const initialVariables = [{ id: '1', key: 'testKey', value: 'testValue' }];
    localStorage.setItem(
      'rest-client-variables',
      JSON.stringify(initialVariables)
    );

    render(<VariablesPage />);

    expect(screen.getByDisplayValue('testKey')).toBeInTheDocument();

    const deleteButton = screen.getByLabelText(/delete/i);
    await user.click(deleteButton);

    expect(screen.queryByDisplayValue('testKey')).not.toBeInTheDocument();
    const storedData = JSON.parse(
      localStorage.getItem('rest-client-variables') || '[]'
    );
    expect(storedData).toHaveLength(0);
  });

  it('should load variables from localStorage on initial render', () => {
    const initialVariables = [
      { id: '1', key: 'persistedKey', value: 'persistedValue' },
    ];
    localStorage.setItem(
      'rest-client-variables',
      JSON.stringify(initialVariables)
    );

    render(<VariablesPage />);

    expect(screen.getByDisplayValue('persistedKey')).toBeInTheDocument();
    expect(screen.getByDisplayValue('persistedValue')).toBeInTheDocument();
  });
});

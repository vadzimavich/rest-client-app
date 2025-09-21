import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import type { User } from 'firebase/auth';
import userEvent from '@testing-library/user-event';
import ClientUI from './ClientUI';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => '/client',
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('@/hooks/useAuth');
vi.mock('@/components/CodeGenerator', () => ({
  default: () => <div data-testid="codegenerator-mock">Code Generator</div>,
}));
vi.mock('@uiw/react-codemirror', () => ({
  default: (
    props: Record<string, unknown> & {
      value: string;
      onChange?: (value: string) => void;
    }
  ) => (
    <textarea
      data-testid={(props['data-testid'] as string) || 'codemirror-mock'}
      value={props.value}
      onChange={(e) => props.onChange?.(e.target.value)}
    />
  ),
}));

describe('ClientUI', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: {
        email: 'test@user.com',
        getIdToken: () => Promise.resolve('fake-token'),
      } as User,
      loading: false,
    });
    vi.spyOn(global, 'fetch').mockImplementation(mockFetch);
  });

  it('should render the main components of the REST client', () => {
    render(<ClientUI />);

    expect(screen.getByDisplayValue('GET')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/https:\/\/api\.example\.com/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /headers/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /body/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /prettify json/i })
    ).toBeInTheDocument();
  });

  it('should update the URL input when user types', async () => {
    render(<ClientUI />);

    const urlInput = screen.getByPlaceholderText(
      /https:\/\/api\.example\.com/i
    );
    await fireEvent.change(urlInput, {
      target: { value: 'https://my-test-api.com' },
    });

    expect(urlInput).toHaveValue('https://my-test-api.com');
  });

  it('should prettify JSON in the body editor', async () => {
    render(<ClientUI />);

    const bodyEditor = screen.getByTestId('request-body-editor');
    const prettifyButton = screen.getByRole('button', {
      name: /prettify json/i,
    });

    await fireEvent.change(bodyEditor, { target: { value: '{"a":1,"b":2}' } });
    await fireEvent.click(prettifyButton);

    const expectedPrettyJson = JSON.stringify({ a: 1, b: 2 }, null, 2);
    expect(bodyEditor).toHaveValue(expectedPrettyJson);
  });

  it('should call fetch with correct parameters on Send button click', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: 200, body: 'OK' }),
    } as Response);

    render(<ClientUI />);
    const urlInput = screen.getByPlaceholderText(
      /https:\/\/api\.example\.com/i
    );
    const sendButton = screen.getByRole('button', { name: /send/i });

    await fireEvent.change(urlInput, {
      target: { value: 'https://my-api.com/data' },
    });
    await fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    const [fetchUrl, fetchOptions] = mockFetch.mock.calls[0];
    expect(fetchUrl).toBe('/api/proxy');
    if (fetchOptions?.body) {
      const body = JSON.parse(fetchOptions.body as string);
      expect(body.url).toBe('https://my-api.com/data');
    }
  });

  it('should display an error message when fetch fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network request failed'));

    render(<ClientUI />);
    const sendButton = screen.getByRole('button', { name: /send/i });

    await fireEvent.click(sendButton);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/network request failed/i);
  });

  it('should display an error when trying to prettify invalid JSON', async () => {
    render(<ClientUI />);

    const bodyEditor = screen.getByTestId('request-body-editor');
    const prettifyButton = screen.getByRole('button', {
      name: /prettify json/i,
    });

    fireEvent.change(bodyEditor, { target: { value: '{ "key": "value"' } });

    await userEvent.click(prettifyButton);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/invalid json format/i);
  });
});

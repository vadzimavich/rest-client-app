/// <reference types="vitest/globals" />

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test-utils/test-utils';
import { useAuth } from '@/hooks/useAuth';
import type { User } from 'firebase/auth';
import userEvent from '@testing-library/user-event';
import ClientUI from './ClientUI';
import { ReadonlyURLSearchParams } from 'next/navigation';

import * as nextIntlNavigation from '@/navigation';
import * as nextNavigation from 'next/navigation';

vi.mock('@/components/codeGenerator/CodeGenerator', () => ({
  default: () => <div data-testid="codegenerator-mock">Code Generator</div>,
}));
vi.mock('@uiw/react-codemirror', () => ({
  default: (props: {
    value: string;
    onChange?: (value: string) => void;
    'data-testid'?: string;
  }) => (
    <textarea
      data-testid={props['data-testid'] || 'codemirror-mock'}
      value={props.value}
      onChange={(e) => props.onChange?.(e.target.value)}
    />
  ),
}));
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('ClientUI', () => {
  const user = userEvent.setup();
  const mockFetch = vi.fn();

  const mockRouterReplace = vi.fn();
  const mockUseRouter = () => ({
    replace: mockRouterReplace,
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
  });

  beforeEach(() => {
    vi.clearAllMocks();

    const stableSearchParams = new URLSearchParams() as ReadonlyURLSearchParams;

    vi.spyOn(nextIntlNavigation, 'useRouter').mockReturnValue(mockUseRouter());
    vi.spyOn(nextIntlNavigation, 'usePathname').mockReturnValue('/client');
    vi.spyOn(nextNavigation, 'useSearchParams').mockReturnValue(
      stableSearchParams
    );

    vi.mocked(useAuth).mockReturnValue({
      user: {
        email: 'test@user.com',
        getIdToken: () => Promise.resolve('fake-token'),
      } as User,
      loading: false,
    });

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: 200, body: 'OK' }),
    });
    vi.spyOn(global, 'fetch').mockImplementation(mockFetch);
  });

  it('should render the main components of the REST client', () => {
    render(<ClientUI />);
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /headers/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /body/i })).toBeInTheDocument();
  });

  it('should update the URL input when user types and update router params', async () => {
    render(<ClientUI />);

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledTimes(1);
    });

    const urlInput = screen.getByPlaceholderText(
      /https:\/\/api\.example\.com/i
    );
    const testUrl = 'https://my-test-api.com';
    await user.type(urlInput, testUrl);
    expect(urlInput).toHaveValue(testUrl);

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledTimes(2);
    });

    const secondCallArgs = mockRouterReplace.mock.calls[1];
    const calledPath = secondCallArgs[0];

    const fullUrl = new URL(`http://localhost${calledPath}`);
    const urlParam = fullUrl.searchParams.get('url');

    expect(urlParam).not.toBeNull();

    if (urlParam) {
      expect(atob(urlParam)).toBe(testUrl);
    }
  });

  it('should prettify JSON in the body editor', async () => {
    render(<ClientUI />);
    const bodyTabButton = screen.getByRole('button', { name: /body/i });
    await user.click(bodyTabButton);

    const bodyEditor = screen.getByTestId('request-body-editor');
    const prettifyButton = screen.getByRole('button', {
      name: /prettify json/i,
    });

    fireEvent.change(bodyEditor, { target: { value: '{"a":1,"b":2}' } });
    await user.click(prettifyButton);

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

    await user.type(urlInput, 'https://my-api.com/data');
    await user.click(sendButton);

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

    await user.click(sendButton);

    expect(
      await screen.findByText(/network request failed/i)
    ).toBeInTheDocument();
  });

  it('should display an error when trying to prettify invalid JSON', async () => {
    render(<ClientUI />);
    const bodyTabButton = screen.getByRole('button', { name: /body/i });
    await user.click(bodyTabButton);

    const bodyEditor = screen.getByTestId('request-body-editor');
    const prettifyButton = screen.getByRole('button', {
      name: /prettify json/i,
    });

    fireEvent.change(bodyEditor, { target: { value: '{ "key": "value"' } });
    await user.click(prettifyButton);

    expect(await screen.findByText(/invalid json format/i)).toBeInTheDocument();
  });
});

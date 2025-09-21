/// <reference types="vitest/globals" />

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test-utils/test-utils';
import { useAuth } from '@/hooks/useAuth';
import type { User } from 'firebase/auth';
import userEvent from '@testing-library/user-event';
import ClientUI from './ClientUI';
import { useDebounce } from '@/hooks/useDebounce';

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

vi.mock('@/hooks/useDebounce');
vi.mock('@/hooks/useAuth');

describe('ClientUI', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: {
        email: 'test@user.com',
        getIdToken: () => Promise.resolve('fake-token'),
      } as User,
      loading: false,
    });
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: 200, body: 'OK' }),
    });
    vi.mocked(useDebounce).mockImplementation((value) => value);
  });

  it('should render the main components of the REST client', () => {
    render(<ClientUI />);
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /headers/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /body/i })).toBeInTheDocument();
  });

  it('should update the URL input when user types', async () => {
    render(<ClientUI />);
    const urlInput = screen.getByPlaceholderText(
      /https:\/\/api\.example\.com/i
    );
    await user.type(urlInput, 'https://my-test-api.com');
    expect(urlInput).toHaveValue('https://my-test-api.com');
  });

  it('should prettify JSON in the body editor', async () => {
    render(<ClientUI />);
    await user.click(screen.getByRole('button', { name: /body/i }));
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
    render(<ClientUI />);
    const urlInput = screen.getByPlaceholderText(
      /https:\/\/api\.example\.com/i
    );
    const sendButton = screen.getByRole('button', { name: /send/i });
    await user.type(urlInput, 'https://my-api.com/data');
    await user.click(sendButton);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('should display an error message when fetch fails', async () => {
    (global.fetch as vi.Mock).mockRejectedValue(
      new Error('Network request failed')
    );
    render(<ClientUI />);
    const sendButton = screen.getByRole('button', { name: /send/i });
    await user.click(sendButton);

    expect(
      await screen.findByText(/network request failed/i, {}, { timeout: 2000 })
    ).toBeInTheDocument();
  });

  it('should display an error when trying to prettify invalid JSON', async () => {
    render(<ClientUI />);
    await user.click(screen.getByRole('button', { name: /body/i }));
    const bodyEditor = screen.getByTestId('request-body-editor');
    const prettifyButton = screen.getByRole('button', {
      name: /prettify json/i,
    });

    fireEvent.change(bodyEditor, { target: { value: '{ "key": "value"' } });
    await user.click(prettifyButton);

    expect(await screen.findByText(/invalid json format/i)).toBeInTheDocument();
  });
});

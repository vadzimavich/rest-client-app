import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ClientUI from './ClientUI';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
  usePathname: () => '/client',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { email: 'test@user.com' },
    loading: false,
  }),
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

vi.mock('@/components/CodeGenerator', () => ({
  default: () => <div data-testid="codegenerator-mock">Code Generator</div>,
}));

describe('ClientUI', () => {
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
});

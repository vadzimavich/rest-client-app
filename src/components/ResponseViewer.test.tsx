import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test-utils/test-utils';
import ResponseViewer from './ResponseViewer';

vi.mock('@uiw/react-codemirror', () => ({
  default: ({ value }: { value: string }) => (
    <pre data-testid="codemirror-mock">{value}</pre>
  ),
}));

describe('ResponseViewer', () => {
  it('should render loading state', () => {
    render(<ResponseViewer data={null} loading={true} />);
    expect(screen.getByText('Loading response...')).toBeInTheDocument();
  });

  it('should render placeholder when no data is provided', () => {
    render(<ResponseViewer data={null} loading={false} />);
    expect(
      screen.getByText('Send a request to see the response here.')
    ).toBeInTheDocument();
  });

  it('should render response data correctly', () => {
    const mockData = {
      status: 200,
      statusText: 'OK',
      body: '{"key":"value"}',
      headers: {},
      duration: 123,
      size: 15,
    };
    render(<ResponseViewer data={mockData} loading={false} />);

    expect(screen.getByText(/200 OK/i)).toBeInTheDocument();
    expect(screen.getByText(/123 ms/i)).toBeInTheDocument();
    expect(screen.getByText(/15 bytes/i)).toBeInTheDocument();

    const codeMirror = screen.getByTestId('codemirror-mock');
    expect(codeMirror.textContent).toContain('"key": "value"');
  });
});

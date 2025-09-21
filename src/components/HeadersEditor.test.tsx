import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HeadersEditor from './HeadersEditor';

describe('HeadersEditor', () => {
  const initialHeaders = [
    { id: '1', key: 'Content-Type', value: 'application/json' },
  ];

  it('should render initial headers correctly', () => {
    render(<HeadersEditor headers={initialHeaders} onChange={vi.fn()} />);

    expect(screen.getByDisplayValue('Content-Type')).toBeInTheDocument();
    expect(screen.getByDisplayValue('application/json')).toBeInTheDocument();
  });

  it('should call onChange when adding a new header', async () => {
    const handleChange = vi.fn();
    render(<HeadersEditor headers={initialHeaders} onChange={handleChange} />);

    const addButton = screen.getByRole('button', { name: /add header/i });
    await fireEvent.click(addButton);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0]).toHaveLength(2);
  });

  it('should call onChange when removing a header', async () => {
    const handleChange = vi.fn();
    render(<HeadersEditor headers={initialHeaders} onChange={handleChange} />);

    const removeButton = screen.getByRole('button', { name: /remove/i });
    await fireEvent.click(removeButton);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0]).toHaveLength(0);
  });

  it('should call onChange when a header value is changed', async () => {
    const handleChange = vi.fn();
    render(<HeadersEditor headers={initialHeaders} onChange={handleChange} />);

    const keyInput = screen.getByDisplayValue('Content-Type');
    await fireEvent.change(keyInput, { target: { value: 'Accept' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0][0].key).toBe('Accept');
  });
});

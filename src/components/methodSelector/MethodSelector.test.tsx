import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test-utils/test-utils';
import userEvent from '@testing-library/user-event';
import MethodSelector from './MethodSelector';

describe('MethodSelector', () => {
  it('should call onChange with the new value when changed', async () => {
    const handleChange = vi.fn();
    render(<MethodSelector value="GET" onChange={handleChange} />);

    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, 'POST');

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('POST');
  });
});

import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';
import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should update the value only after the delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 500 } }
    );

    expect(result.current).toBe('first');

    rerender({ value: 'second', delay: 500 });
    expect(result.current).toBe('first');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('second');
  });

  it('should reset the timeout if the value changes again before delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 500 } }
    );

    rerender({ value: 'b', delay: 500 });

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('a');

    rerender({ value: 'c', delay: 500 });
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('c');
  });
});

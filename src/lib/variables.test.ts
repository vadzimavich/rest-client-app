import { describe, it, expect } from 'vitest';
import { getVariables, substituteVariables } from './variables';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('getVariables', () => {
  it('should return an empty array if localStorage contains invalid JSON', () => {
    localStorage.setItem('rest-client-variables', 'this is not json');
    const vars = getVariables();
    expect(vars).toEqual([]);
  });
});

describe('substituteVariables', () => {
  const variables = [
    { id: '1', key: 'baseUrl', value: 'https://api.example.com' },
    { id: '2', key: 'userId', value: '123' },
    { id: '3', key: 'token', value: 'xyz-abc' },
  ];

  it('should substitute a single variable in the URL', () => {
    const input = '{{baseUrl}}/users';
    const expected = 'https://api.example.com/users';
    expect(substituteVariables(input, variables)).toBe(expected);
  });

  it('should substitute multiple variables', () => {
    const input = '{{baseUrl}}/users/{{userId}}';
    const expected = 'https://api.example.com/users/123';
    expect(substituteVariables(input, variables)).toBe(expected);
  });

  it('should substitute variables in header values', () => {
    const input = 'Bearer {{token}}';
    const expected = 'Bearer xyz-abc';
    expect(substituteVariables(input, variables)).toBe(expected);
  });

  it('should substitute variables in a JSON body', () => {
    const input = '{ "id": "{{userId}}", "data": "some-data" }';
    const expected = '{ "id": "123", "data": "some-data" }';
    expect(substituteVariables(input, variables)).toBe(expected);
  });

  it('should not substitute non-existent variables', () => {
    const input = '{{baseUrl}}/orders/{{orderId}}';
    const expected = 'https://api.example.com/orders/{{orderId}}';
    expect(substituteVariables(input, variables)).toBe(expected);
  });

  it('should return the original string if no variables are present', () => {
    const input = 'https://api.google.com/health';
    expect(substituteVariables(input, variables)).toBe(input);
  });

  it('should handle an empty input string', () => {
    const input = '';
    expect(substituteVariables(input, variables)).toBe('');
  });

  it('should handle an empty array of variables', () => {
    const input = '{{baseUrl}}/users';
    expect(substituteVariables(input, [])).toBe(input);
  });
});

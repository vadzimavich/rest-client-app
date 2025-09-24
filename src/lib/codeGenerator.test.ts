import { describe, it, expect, vi } from 'vitest';
import { generateCodeSnippet } from './codeGenerator';
import { RequestState } from '@/types/request';

vi.mock('postman-collection', () => ({
  Request: class MockRequest {
    constructor(options: unknown) {
      Object.assign(this, options);
    }
  },
}));

const mockConvert = vi.fn((lang, variant, request, options, callback) => {
  callback(null, `Generated snippet for ${lang}-${variant}`);
});
vi.mock('postman-code-generators', () => ({
  default: {
    convert: mockConvert,
  },
}));

describe('generateCodeSnippet', () => {
  it('should call postman-code-generators with correct parameters', async () => {
    const requestState: RequestState = {
      method: 'POST',
      url: 'https://api.test.com/data',
      headers: [
        { id: '1', key: 'Content-Type', value: 'application/json' },
        { id: '2', key: 'Authorization', value: 'Bearer 123' },
      ],
      body: '{"key":"value"}',
    };

    const lang = 'javascript';
    const variant = 'fetch';

    const snippet = await generateCodeSnippet(requestState, lang, variant);

    expect(snippet).toBe('Generated snippet for javascript-fetch');
    expect(mockConvert).toHaveBeenCalledTimes(1);

    const [calledLang, calledVariant, calledRequest] =
      mockConvert.mock.calls[0];

    expect(calledLang).toBe(lang);
    expect(calledVariant).toBe(variant);
    expect(calledRequest.method).toBe('POST');
    expect(calledRequest.url).toBe('https://api.test.com/data');
    expect(calledRequest.body.raw).toBe('{"key":"value"}');
    expect(calledRequest.header).toEqual([
      { key: 'Content-Type', value: 'application/json' },
      { key: 'Authorization', value: 'Bearer 123' },
    ]);
  });
});

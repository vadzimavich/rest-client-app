import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@/test-utils/test-utils';
import userEvent from '@testing-library/user-event';
import CodeGenerator from './CodeGenerator';
import { RequestState } from '@/types/request';
import * as codeGenerator from '@/lib/codeGenerator';

vi.mock('@uiw/react-codemirror', () => ({
  default: ({ value }: { value: string }) => (
    <pre data-testid="codemirror-mock">{value}</pre>
  ),
}));

vi.mock('@codemirror/language', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@codemirror/language')>();
  return {
    ...actual,
    StreamLanguage: {
      define: vi.fn(),
    },
  };
});

describe('CodeGenerator', () => {
  const user = userEvent.setup();

  it('should display a placeholder message when no URL is provided', () => {
    const emptyRequestState: RequestState = {
      method: 'GET',
      url: '',
      headers: [],
      body: '',
    };
    render(<CodeGenerator requestState={emptyRequestState} />);
    const codeMirror = screen.getByTestId('codemirror-mock');
    expect(codeMirror.textContent).toContain(
      'Enter a URL to generate a code snippet.'
    );
  });

  it('should call generateCodeSnippet and display the result', async () => {
    const generateSpy = vi
      .spyOn(codeGenerator, 'generateCodeSnippet')
      .mockResolvedValue('curl "https://api.example.com"');

    const requestStateWithUrl: RequestState = {
      method: 'GET',
      url: 'https://api.example.com',
      headers: [],
      body: '',
    };
    render(<CodeGenerator requestState={requestStateWithUrl} />);

    await waitFor(() => {
      const codeMirror = screen.getByTestId('codemirror-mock');
      expect(codeMirror.textContent).toContain(
        'curl "https://api.example.com"'
      );
    });

    expect(generateSpy).toHaveBeenCalledTimes(1);
  });

  it('should regenerate snippet when language is changed', async () => {
    const generateSpy = vi
      .spyOn(codeGenerator, 'generateCodeSnippet')
      .mockResolvedValue('Generated snippet');

    const requestStateWithUrl: RequestState = {
      method: 'GET',
      url: 'https://api.example.com',
      headers: [],
      body: '',
    };
    render(<CodeGenerator requestState={requestStateWithUrl} />);

    await waitFor(() => {
      expect(generateSpy).toHaveBeenCalledTimes(1);
    });

    const languageSelect = screen.getByRole('combobox');
    await user.selectOptions(languageSelect, '1');

    await waitFor(() => {
      expect(generateSpy).toHaveBeenCalledTimes(2);
    });

    expect(languageSelect).toHaveValue('1');
  });

  it('should display an error message if snippet generation fails', async () => {
    const errorMessage = 'Generation failed';
    const generateSpy = vi
      .spyOn(codeGenerator, 'generateCodeSnippet')
      .mockRejectedValue(new Error(errorMessage));

    const requestStateWithUrl: RequestState = {
      method: 'GET',
      url: 'https://api.example.com',
      headers: [],
      body: '',
    };
    render(<CodeGenerator requestState={requestStateWithUrl} />);

    await waitFor(() => {
      const codeMirror = screen.getByTestId('codemirror-mock');
      expect(codeMirror.textContent).toContain(
        `Error generating snippet: ${errorMessage}`
      );
    });

    expect(generateSpy).toHaveBeenCalledTimes(1);
  });
});

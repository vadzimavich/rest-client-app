"use client";

import { useState, useEffect } from 'react';
import { RequestState } from '@/types/request';
import { generateCodeSnippet } from '@/lib/codeGenerator';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { StreamLanguage } from '@codemirror/language';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { csharp } from '@codemirror/legacy-modes/mode/clike';
import { go } from '@codemirror/legacy-modes/mode/go';
import { Extension } from '@codemirror/state';

interface CodeGeneratorProps {
  requestState: RequestState;
}

interface LanguageOption {
  lang: string;
  variant: string;
  name: string;
  extension: () => Extension;
}

const languages: LanguageOption[] = [
  { lang: 'curl', variant: 'curl', name: 'cURL', extension: () => StreamLanguage.define(shell) },
  { lang: 'javascript', variant: 'fetch', name: 'JavaScript (Fetch)', extension: () => javascript() },
  { lang: 'javascript', variant: 'xhr', name: 'JavaScript (XHR)', extension: () => javascript() },
  { lang: 'nodejs', variant: 'Native', name: 'Node.js (Native)', extension: () => javascript() },
  { lang: 'python', variant: 'requests', name: 'Python (Requests)', extension: () => python() },
  { lang: 'java', variant: 'okhttp', name: 'Java (OkHttp)', extension: () => java() },
  { lang: 'csharp', variant: 'restsharp', name: 'C# (RestSharp)', extension: () => StreamLanguage.define(csharp) },
  { lang: 'go', variant: 'native', name: 'Go (Native)', extension: () => StreamLanguage.define(go) },
];

export default function CodeGenerator({ requestState }: CodeGeneratorProps) {
  const [selectedLang, setSelectedLang] = useState(0);
  const [snippet, setSnippet] = useState('');

  useEffect(() => {
    if (!requestState.url) {
      setSnippet('Enter a URL to generate a code snippet.');
      return;
    }

    const { lang, variant } = languages[selectedLang];
    generateCodeSnippet(requestState, lang, variant)
      .then(setSnippet)
      .catch(err => setSnippet(`Error generating snippet: ${err.message}`));
  }, [requestState, selectedLang]);

  return (
    <div style={{ marginTop: '1rem' }}>
      <h4>Generated Code</h4>
      <select
        value={selectedLang}
        onChange={(e) => setSelectedLang(Number(e.target.value))}
        style={{ marginBottom: '0.5rem' }}
      >
        {languages.map((lang, index) => (
          <option key={index} value={index}>{lang.name}</option>
        ))}
      </select>
      <CodeMirror
        value={snippet}
        height="200px"
        extensions={[languages[selectedLang].extension()]}
        theme={vscodeDark}
        readOnly={true}
      />
    </div>
  );
}

'use client';

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
import { useTranslations } from 'next-intl';
import styles from './CodeGenerator.module.css';

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
  {
    lang: 'curl',
    variant: 'curl',
    name: 'cURL',
    extension: () => StreamLanguage.define(shell),
  },
  {
    lang: 'javascript',
    variant: 'fetch',
    name: 'JavaScript (Fetch)',
    extension: () => javascript(),
  },
  {
    lang: 'javascript',
    variant: 'xhr',
    name: 'JavaScript (XHR)',
    extension: () => javascript(),
  },
  {
    lang: 'nodejs',
    variant: 'Native',
    name: 'Node.js (Native)',
    extension: () => javascript(),
  },
  {
    lang: 'python',
    variant: 'requests',
    name: 'Python (Requests)',
    extension: () => python(),
  },
  {
    lang: 'java',
    variant: 'okhttp',
    name: 'Java (OkHttp)',
    extension: () => java(),
  },
  {
    lang: 'csharp',
    variant: 'restsharp',
    name: 'C# (RestSharp)',
    extension: () => StreamLanguage.define(csharp),
  },
  {
    lang: 'go',
    variant: 'native',
    name: 'Go (Native)',
    extension: () => StreamLanguage.define(go),
  },
];

export default function CodeGenerator({ requestState }: CodeGeneratorProps) {
  const t = useTranslations('CodeGenerator');
  const [selectedLang, setSelectedLang] = useState(0);
  const [snippet, setSnippet] = useState('');

  useEffect(() => {
    if (!requestState.url) {
      setSnippet(t('placeholder'));
      return;
    }

    const { lang, variant } = languages[selectedLang];
    generateCodeSnippet(requestState, lang, variant)
      .then(setSnippet)
      .catch((err) => setSnippet(t('error', { errorMessage: err.message })));
  }, [requestState, selectedLang, t]);

  return (
    <div className={styles.generatorContainer}>
      <div className={styles.header}>
        <h4 className={styles.title}>{t('title')}</h4>
        <div className={styles.selectWrapper}>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(Number(e.target.value))}
            className={styles.langSelect}
          >
            {languages.map((lang, index) => (
              <option key={index} value={index}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.codeContainer}>
        <CodeMirror
          value={snippet}
          height="200px"
          extensions={[
            typeof languages[selectedLang].extension === 'function'
              ? (languages[selectedLang].extension as () => Extension)()
              : languages[selectedLang].extension,
          ]}
          theme={vscodeDark}
          readOnly={true}
        />
      </div>
    </div>
  );
}

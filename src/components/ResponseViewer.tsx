'use client';

import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { useTranslations } from 'next-intl';

interface ResponseData {
  status: number;
  statusText: string;
  body: string;
  headers: Record<string, string>;
  duration: number;
  size: number;
}

interface ResponseViewerProps {
  data: ResponseData | null;
  loading: boolean;
}

export default function ResponseViewer({ data, loading }: ResponseViewerProps) {
  const t = useTranslations('ResponseViewer');

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  if (!data) {
    return <div>{t('placeholder')}</div>;
  }

  let formattedBody = data.body;
  try {
    const parsedJson = JSON.parse(data.body);
    formattedBody = JSON.stringify(parsedJson, null, 2);
  } catch (e) {
    // if not JSON leave as it is
  }

  return (
    <div>
      <h3>{t('title')}</h3>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <span>
          <strong>{t('statusLabel')}:</strong> {data.status} {data.statusText}
        </span>
        <span>
          <strong>{t('timeLabel')}:</strong> {data.duration} ms
        </span>
        <span>
          <strong>{t('sizeLabel')}:</strong> {data.size} bytes
        </span>
      </div>

      <h4>{t('bodyTitle')}:</h4>

      <CodeMirror
        value={formattedBody}
        height="300px"
        extensions={[json()]}
        theme={vscodeDark}
        readOnly={true}
      />
    </div>
  );
}

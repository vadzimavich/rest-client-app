'use client';

import CodeMirror from '@uiw/react-codemirror';
import { useTranslations } from 'next-intl';
import { json } from '@codemirror/lang-json';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import styles from './ResponseViewer.module.css';
import { ResponseData } from '@/types/response';

interface ResponseViewerProps {
  data: ResponseData | null;
  loading: boolean;
}

export default function ResponseViewer({ data, loading }: ResponseViewerProps) {
  const t = useTranslations('ResponseViewer');

  if (loading) {
    return <div className={styles.message}>{t('loading')}</div>;
  }

  if (!data) {
    return <div className={styles.message}>{t('placeholder')}</div>;
  }

  let formattedBody = data.body;
  try {
    const parsedJson = JSON.parse(data.body);
    formattedBody = JSON.stringify(parsedJson, null, 2);
  } catch (e) {
    // leave as it is if not valid JSON
  }

  const statusClass =
    data.status >= 200 && data.status < 300
      ? styles.statusSuccess
      : data.status >= 400 && data.status < 500
        ? styles.statusWarning
        : data.status >= 500
          ? styles.statusError
          : '';

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t('title')}</h3>

      <div className={styles.meta}>
        <span className={`${styles.metaItem} ${statusClass}`}>
          <strong>{t('statusLabel')}:</strong> {data.status}{' '}
          {data.statusText}{' '}
        </span>
        <span className={styles.metaItem}>
          <strong>{t('timeLabel')}:</strong> {data.duration} ms{' '}
        </span>
        <span className={styles.metaItem}>
          <strong>{t('sizeLabel')}:</strong> {data.size} bytes{' '}
        </span>
      </div>

      <h4 className={styles.subtitle}>{t('bodyTitle')}:</h4>

      <div className={styles.bodyContainer}>
        <CodeMirror
          value={formattedBody}
          height="500px"
          extensions={[json()]}
          theme={vscodeDark}
          readOnly={true}
        />
      </div>
    </div>
  );
}

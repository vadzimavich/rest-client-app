'use client';

import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import styles from './ResponseViewer.module.css';
import { ResponseData } from '@/types/response';

interface ResponseViewerProps {
  data: ResponseData | null;
  loading: boolean;
}

export default function ResponseViewer({ data, loading }: ResponseViewerProps) {
  if (loading) {
    return <div className={styles.message}>Loading response...</div>;
  }

  if (!data) {
    return <div className={styles.message}>Send a request to see the response here.</div>;
  }

  let formattedBody = data.body;
  try {
    const parsedJson = JSON.parse(data.body);
    formattedBody = JSON.stringify(parsedJson, null, 2);
  } catch (e) {}

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
      <h3 className={styles.title}>Response</h3>

      <div className={styles.meta}>
        <span className={`${styles.metaItem} ${statusClass}`}>
          <strong>Status:</strong> {data.status} {data.statusText}
        </span>
        <span className={styles.metaItem}>
          <strong>Time:</strong> {data.duration} ms
        </span>
        <span className={styles.metaItem}>
          <strong>Size:</strong> {data.size} bytes
        </span>
      </div>

      <h4 className={styles.subtitle}>Body:</h4>

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

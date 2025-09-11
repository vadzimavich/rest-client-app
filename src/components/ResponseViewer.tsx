'use client';

import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { vscodeDark } from '@uiw/codemirror-theme-vscode'; // theme can be changed

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
  if (loading) {
    return <div>Loading response...</div>;
  }

  if (!data) {
    return <div>Send a request to see the response here.</div>;
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
      <h3>Response</h3>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <span>
          <strong>Status:</strong> {data.status} {data.statusText}
        </span>
        <span>
          <strong>Time:</strong> {data.duration} ms
        </span>
        <span>
          <strong>Size:</strong> {data.size} bytes
        </span>
      </div>

      <h4>Body:</h4>

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

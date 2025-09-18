'use client';

import { useState } from 'react';
import PrivateRoute from '@/components/PrivateRoute';
import { RequestState } from '@/types/request';
import MethodSelector from '@/components/MethodSelector';
import HeadersEditor from '@/components/HeadersEditor';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import ResponseViewer from '@/components/ResponseViewer';

interface ResponseData {
  status: number;
  statusText: string;
  body: string;
  headers: Record<string, string>;
  duration: number;
  size: number;
}

const initialRequestState: RequestState = {
  method: 'GET',
  url: '',
  headers: [{ id: crypto.randomUUID(), key: '', value: '' }],
  body: '',
};

export default function ClientPage() {
  const [requestState, setRequestState] =
    useState<RequestState>(initialRequestState);

  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendRequest = async () => {
    setIsLoading(true);
    setResponseData(null);
    setError(null);

    const headersObject = requestState.headers.reduce(
      (acc, header) => {
        if (header.key) {
          acc[header.key] = header.value;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    let parsedBody: unknown;
    try {
      parsedBody = JSON.parse(requestState.body);
    } catch {
      parsedBody = requestState.body;
    }

    try {
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: requestState.method,
          url: requestState.url,
          headers: headersObject,
          body: parsedBody,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An unknown error occurred');
      }

      setResponseData(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrettify = () => {
    try {
      const prettyBody = JSON.stringify(JSON.parse(requestState.body), null, 2);
      setRequestState((prev) => ({ ...prev, body: prettyBody }));
    } catch (error) {
      console.error('Invalid JSON for prettifying');
    }
  };

  return (
    <PrivateRoute>
      <h1>REST Client</h1>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <MethodSelector
          value={requestState.method}
          onChange={(method) =>
            setRequestState((prev) => ({ ...prev, method }))
          }
        />
        <input
          type="text"
          placeholder="https://api.example.com"
          style={{ flex: 1 }}
          value={requestState.url}
          onChange={(e) =>
            setRequestState((prev) => ({ ...prev, url: e.target.value }))
          }
        />
        <button onClick={handleSendRequest} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>

      <HeadersEditor
        headers={requestState.headers}
        onChange={(headers) =>
          setRequestState((prev) => ({ ...prev, headers }))
        }
      />

      <div style={{ marginTop: '1rem' }}>
        <h4>Body</h4>
        <button onClick={handlePrettify} style={{ marginBottom: '0.5rem' }}>
          Prettify JSON
        </button>
        <CodeMirror
          value={requestState.body}
          height="200px"
          extensions={[json()]}
          theme={vscodeDark}
          onChange={(value) =>
            setRequestState((prev) => ({ ...prev, body: value }))
          }
        />
      </div>

      <hr style={{ margin: '2rem 0' }} />
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <ResponseViewer data={responseData} loading={isLoading} />
    </PrivateRoute>
  );
}

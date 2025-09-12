"use client";

import { useState } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import { RequestState } from "@/types/request";
import MethodSelector from "@/components/MethodSelector";
import HeadersEditor from "@/components/HeadersEditor";
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

const initialRequestState: RequestState = {
  method: 'GET',
  url: '',
  headers: [{ id: crypto.randomUUID(), key: '', value: '' }],
  body: '',
};

export default function ClientPage() {
  const [requestState, setRequestState] = useState<RequestState>(initialRequestState);

  const handlePrettify = () => {
    try {
      const prettyBody = JSON.stringify(JSON.parse(requestState.body), null, 2);
      setRequestState(prev => ({ ...prev, body: prettyBody }));
    } catch (error) {
      console.error("Invalid JSON for prettifying");
    }
  };

  return (
    <PrivateRoute>
      <h1>REST Client</h1>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <MethodSelector
          value={requestState.method}
          onChange={(method) => setRequestState(prev => ({ ...prev, method }))}
        />
        <input
          type="text"
          placeholder="https://api.example.com"
          style={{ flex: 1 }}
          value={requestState.url}
          onChange={(e) => setRequestState(prev => ({ ...prev, url: e.target.value }))}
        />
        <button>Send</button>
      </div>

      <HeadersEditor
        headers={requestState.headers}
        onChange={(headers) => setRequestState(prev => ({ ...prev, headers }))}
      />

      <div style={{ marginTop: '1rem' }}>
        <h4>Body</h4>
        <button onClick={handlePrettify} style={{ marginBottom: '0.5rem' }}>Prettify JSON</button>
        <CodeMirror
          value={requestState.body}
          height="200px"
          extensions={[json()]}
          theme={vscodeDark}
          onChange={(value) => setRequestState(prev => ({ ...prev, body: value }))}
        />
      </div>
    </PrivateRoute>
  );
}

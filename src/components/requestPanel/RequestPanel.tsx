"use client";

import { Dispatch, SetStateAction } from "react";
import { RequestState } from "@/types/request";
import { ResponseData } from "@/types/response";
import MethodSelector from "@/components/methodSelector/MethodSelector";
import HeadersEditor from "@/components/headersEditor/HeadersEditor";
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import CodeGenerator from "@/components/codeGenerator/CodeGenerator";
import Tabs from "@/components/tabs/Tabs";
import styles from './RequestPanel.module.css';

interface RequestPanelProps {
  requestState: RequestState;
  setRequestState: Dispatch<SetStateAction<RequestState>>;
  setResponseData: Dispatch<SetStateAction<ResponseData | null>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
  isLoading: boolean;
}

export default function RequestPanel({
  requestState,
  setRequestState,
  setResponseData,
  setIsLoading,
  setError,
  isLoading,
}: RequestPanelProps) {

  const handlePrettify = () => {
    if (!requestState.body) return;
    try {
      const prettyBody = JSON.stringify(JSON.parse(requestState.body), null, 2);
      setRequestState(prev => ({ ...prev, body: prettyBody }));
      setError(null);
    } catch {
      setError("Invalid JSON format. Cannot prettify.");
    }
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    setResponseData(null);
    setError(null);
    try {
      const headersObject = requestState.headers.reduce((acc, header) => {
        if (header.key) acc[header.key] = header.value;
        return acc;
      }, {} as Record<string, string>);

      let parsedBody: unknown;
      try {
        parsedBody = requestState.body ? JSON.parse(requestState.body) : null;
      } catch {
        parsedBody = requestState.body;
      }

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

      const data: ResponseData = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unknown proxy error');
      setResponseData(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.requestPanel}>
      <div className={styles.requestRow}>
        <MethodSelector
          value={requestState.method}
          onChange={method => setRequestState(prev => ({ ...prev, method }))}
        />
        <input
          type="text"
          placeholder="https://api.example.com"
          value={requestState.url}
          onChange={e => setRequestState(prev => ({ ...prev, url: e.target.value }))}
        />
        <button onClick={handleSendRequest} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>

      <Tabs labels={['Headers', 'Body']}>
        <HeadersEditor
          headers={requestState.headers}
          onChange={headers => setRequestState(prev => ({ ...prev, headers }))}
        />

        <div className={styles.bodyEditor}>
          <button onClick={handlePrettify}>Prettify JSON</button>
          <CodeMirror
            value={requestState.body}
            height="200px"
            extensions={[json()]}
            theme={vscodeDark}
            onChange={value => setRequestState(prev => ({ ...prev, body: value }))}
          />
        </div>
      </Tabs>

      <CodeGenerator requestState={requestState} />
    </div>
  );
}

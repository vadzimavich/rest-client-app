"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { RequestState, RequestHeader, HttpMethod } from "@/types/request";
import MethodSelector from "@/components/MethodSelector";
import HeadersEditor from "@/components/HeadersEditor";
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import ResponseViewer from "@/components/ResponseViewer";
import CodeGenerator from "@/components/CodeGenerator";

interface ResponseData {
  status: number;
  statusText: string;
  body: string;
  headers: Record<string, string>;
  duration: number;
  size: number;
}

// URL decoding
const safeDecode = (str: string | null | undefined): string => {
  if (!str) return "";
  try { return atob(str); } catch (e) { return ""; }
};

const safeEncode = (str: string | null | undefined): string => {
  if (!str) return "";
  try { return btoa(str); } catch (e) { return ""; }
};

const parseStateFromParams = (params: URLSearchParams): RequestState => {
  const method = (params.get('method') as HttpMethod) || 'GET';
  const url = safeDecode(params.get('url'));
  const body = safeDecode(params.get('body'));
  
  const headers: RequestHeader[] = [];
  params.forEach((value, key) => {
    if (key !== 'method' && key !== 'url' && key !== 'body') {
      headers.push({ id: crypto.randomUUID(), key, value });
    }
  });
  if (headers.length === 0) {
    headers.push({ id: crypto.randomUUID(), key: '', value: '' });
  }

  return { method, url, body, headers };
};

// component is authonomous now & doesn't receive props
export default function ClientUI() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [requestState, setRequestState] = useState<RequestState>({
    method: 'GET',
    url: '',
    body: '',
    headers: [{ id: crypto.randomUUID(), key: '', value: '' }],
  });

  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isInitialLoad = useRef(true);

  // auto refresh URL effects
  useEffect(() => {
    if (isInitialLoad.current) {
      const stateFromUrl = parseStateFromParams(searchParams);
      setRequestState(stateFromUrl);
      isInitialLoad.current = false;
    }
  }, [searchParams]);

  useEffect(() => {
    if (isInitialLoad.current) return;

    const params = new URLSearchParams();
    params.set('method', requestState.method);
    
    const encodedUrl = safeEncode(requestState.url);
    if (encodedUrl) params.set('url', encodedUrl);

    const encodedBody = safeEncode(requestState.body);
    if (encodedBody) params.set('body', encodedBody);
    
    requestState.headers.forEach(h => {
      if (h.key) params.set(h.key, h.value);
    });

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [requestState, router, pathname]);

  const handlePrettify = () => {
    if (!requestState.body) return;
    try {
      const prettyBody = JSON.stringify(JSON.parse(requestState.body), null, 2);
      setRequestState(prev => ({ ...prev, body: prettyBody }));
      setError(null);
    } catch (err) {
      setError("Invalid JSON format. Cannot prettify.");
    }
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    setResponseData(null);
    setError(null);
    try {
      const headersObject = requestState.headers.reduce((acc, header) => {
        if (header.key) {
          acc[header.key] = header.value;
        }
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

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'An unknown proxy error occurred');
      }
      
      setResponseData(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
        <button onClick={handleSendRequest} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
      <HeadersEditor
        headers={requestState.headers}
        onChange={(headers: RequestHeader[]) => setRequestState(prev => ({ ...prev, headers }))}
      />
      <div style={{ marginTop: '1rem' }}>
        <h4>Body</h4>
        <button onClick={handlePrettify} style={{ marginBottom: '0.5rem' }}>Prettify JSON</button>
        <CodeMirror
          value={requestState.body}
          height="200px"
          extensions={[json()]}
          theme={vscodeDark}
          onChange={(value: string) => setRequestState(prev => ({ ...prev, body: value }))}
        />
      </div>
      <CodeGenerator requestState={requestState} />
      <hr style={{ margin: '2rem 0' }} />
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <ResponseViewer data={responseData} loading={isLoading} />
    </>
  );
}

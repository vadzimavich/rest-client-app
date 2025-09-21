'use client';

import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { RequestState, RequestHeader, HttpMethod } from '@/types/request';
import MethodSelector from '@/components/MethodSelector';
import HeadersEditor from '@/components/HeadersEditor';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import ResponseViewer from '@/components/ResponseViewer';
import CodeGenerator from '@/components/CodeGenerator';
import { getVariables, substituteVariables } from '@/lib/variables';
import { useTranslations } from 'next-intl';

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
  if (!str) return '';
  try {
    return atob(str);
  } catch (e) {
    return '';
  }
};

const safeEncode = (str: string | null | undefined): string => {
  if (!str) return '';
  try {
    return btoa(str);
  } catch (e) {
    return '';
  }
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
  const t = useTranslations('ClientUI');
  const { user } = useAuth();
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
  const debouncedRequestState = useDebounce(requestState, 500);

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

    const variables = getVariables();
    const finalUrl = substituteVariables(debouncedRequestState.url, variables);
    const finalBody = substituteVariables(
      debouncedRequestState.body,
      variables
    );

    const params = new URLSearchParams();
    params.set('method', debouncedRequestState.method);

    const encodedUrl = safeEncode(finalUrl);
    if (encodedUrl) params.set('url', encodedUrl);

    const encodedBody = safeEncode(finalBody);
    if (encodedBody) params.set('body', encodedBody);

    debouncedRequestState.headers.forEach((h) => {
      if (h.key) {
        const finalHeaderValue = substituteVariables(h.value, variables);
        params.set(h.key, finalHeaderValue);
      }
    });

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedRequestState, router, pathname]);

  const handlePrettify = () => {
    if (!requestState.body) return;
    try {
      const prettyBody = JSON.stringify(JSON.parse(requestState.body), null, 2);
      setRequestState((prev) => ({ ...prev, body: prettyBody }));
      setError(null);
    } catch (err) {
      setError(t('prettifyError'));
    }
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    setResponseData(null);
    setError(null);

    // auth check
    if (!user) {
      setError(t('authError'));
      setIsLoading(false);
      return;
    }

    try {
      // get token
      const idToken = await user.getIdToken();

      const variables = getVariables();
      const finalUrl = substituteVariables(requestState.url, variables);
      const finalHeaders = requestState.headers.map((header) => ({
        ...header,
        value: substituteVariables(header.value, variables),
      }));
      const finalBody = substituteVariables(requestState.body, variables);

      // format data before sending to proxy
      const headersObject = finalHeaders.reduce(
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
        parsedBody = finalBody ? JSON.parse(finalBody) : null;
      } catch {
        parsedBody = finalBody;
      }

      // send to proxy
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          method: requestState.method,
          url: finalUrl,
          headers: headersObject,
          body: parsedBody,
        }),
      });

      const data = await response.json();

      // process response
      if (!response.ok) {
        // our proxy error
        throw new Error(data.error || 'An unknown proxy error occurred');
      }

      // successful proxy response (even if 404 etc)
      setResponseData(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('unexpectedError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1>{t('title')}</h1>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <MethodSelector
          value={requestState.method}
          onChange={(method) =>
            setRequestState((prev) => ({ ...prev, method }))
          }
        />
        <input
          type="text"
          placeholder={t('urlPlaceholder')}
          style={{ flex: 1 }}
          value={requestState.url}
          onChange={(e) =>
            setRequestState((prev) => ({ ...prev, url: e.target.value }))
          }
        />
        <button onClick={handleSendRequest} disabled={isLoading}>
          {isLoading ? t('sendingButton') : t('sendButton')}
        </button>
      </div>
      <HeadersEditor
        headers={requestState.headers}
        onChange={(headers) =>
          setRequestState((prev) => ({ ...prev, headers }))
        }
      />
      <div style={{ marginTop: '1rem' }}>
        <h4>{t('bodyTitle')}</h4>
        <button onClick={handlePrettify} style={{ marginBottom: '0.5rem' }}>
          {t('prettifyButton')}
        </button>
        <CodeMirror
          data-testid="request-body-editor"
          value={requestState.body}
          height="200px"
          extensions={[json()]}
          theme={vscodeDark}
          onChange={(value: string) =>
            setRequestState((prev) => ({ ...prev, body: value }))
          }
        />
      </div>
      <CodeGenerator requestState={requestState} />
      <hr style={{ margin: '2rem 0' }} />
      {error && (
        <div role="alert" style={{ color: 'red' }}>
          Error: {error}
        </div>
      )}
      <ResponseViewer data={responseData} loading={isLoading} />
    </>
  );
}

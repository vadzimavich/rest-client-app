'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import { useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import RequestPanel from '@/components/requestPanel/RequestPanel';
import ResponsePanel from '@/components/responsePanel/ResponsePanel';
import { RequestState, RequestHeader, HttpMethod } from '@/types/request';
import { ResponseData } from '@/types/response';
import styles from './ClientUI.module.css';

const safeDecode = (str: string | null): string => {
  if (!str) return '';
  try {
    return atob(str);
  } catch (e) {
    console.error('Failed to decode base64 string:', e);
    return '';
  }
};

const safeEncode = (str: string): string => {
  if (!str) return '';
  try {
    return btoa(str);
  } catch (e) {
    console.error('Failed to encode string to base64:', e);
    return '';
  }
};

const parseStateFromParams = (params: URLSearchParams): RequestState => {
  const method = (params.get('method') as HttpMethod) || 'GET';
  const url = safeDecode(params.get('url'));
  const body = safeDecode(params.get('body'));

  const headers: RequestHeader[] = [];
  params.forEach((value, key) => {
    if (!['method', 'url', 'body'].includes(key)) {
      headers.push({ id: crypto.randomUUID(), key, value });
    }
  });

  if (headers.length === 0) {
    headers.push({ id: crypto.randomUUID(), key: '', value: '' });
  }

  return { method, url, body, headers };
};

export default function ClientUI() {
  const t = useTranslations('ClientUI');
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
    params.set('method', debouncedRequestState.method);
    params.set('url', safeEncode(debouncedRequestState.url));
    params.set('body', safeEncode(debouncedRequestState.body));

    debouncedRequestState.headers.forEach((h) => {
      if (h.key) {
        params.set(h.key, h.value);
      }
    });

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedRequestState, router, pathname]);

  return (
    <div className={styles.clientContainer}>
      <h1 className={styles.title}>{t('title')}</h1>

      <div className={styles.panels}>
        <div className={styles.panel}>
          <RequestPanel
            requestState={requestState}
            setRequestState={setRequestState}
            setResponseData={setResponseData}
            setIsLoading={setIsLoading}
            setError={setError}
            isLoading={isLoading}
          />
        </div>

        <div className={styles.panel}>
          <ResponsePanel
            responseData={responseData}
            loading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}

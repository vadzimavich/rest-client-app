import { NextResponse } from 'next/server';

interface ProxyRequestBody {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers: Record<string, string>;
  body?: unknown;
}

const PROXY_TIMEOUT = 15000;

export async function POST(request: Request) {
  try {
    const { url, method, headers, body }: ProxyRequestBody =
      await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), PROXY_TIMEOUT);

    // deleting headers created automatically by browser/next.js
    const headersToSend = { ...headers };
    delete headersToSend['host'];
    delete headersToSend['connection'];
    // can be added

    const options: RequestInit = {
      method,
      headers: headersToSend,
      body:
        body && (method === 'POST' || method === 'PUT' || method === 'PATCH')
          ? JSON.stringify(body)
          : undefined,
      signal: controller.signal,
    };

    // calculate response time
    const startTime = performance.now();
    const apiResponse = await fetch(url, options);
    clearTimeout(timeoutId);

    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    const responseBody = await apiResponse.text();

    // calculate response size
    const responseSize = new Blob([responseBody]).size;

    const responseData = {
      status: apiResponse.status,
      statusText: apiResponse.statusText,
      body: responseBody,
      headers: Object.fromEntries(apiResponse.headers.entries()),
      duration: duration,
      size: responseSize,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: unknown) {
    let errorMessage = 'An unexpected network error occurred.';

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = `Request timed out after ${PROXY_TIMEOUT / 1000} seconds.`;
      } else {
        errorMessage = `Proxy error: ${error.message}`;
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { firestore } from '@/lib/firebase/admin';

interface FirebaseError extends Error {
  code: string;
}

function isFirebaseError(error: unknown): error is FirebaseError {
  return (
    error instanceof Error &&
    'code' in error &&
    typeof (error as FirebaseError).code === 'string'
  );
}

interface ProxyRequestBody {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers: Record<string, string>;
  body?: unknown;
}

const PROXY_TIMEOUT = 15000;

export async function POST(request: Request) {
  try {
    const authToken = request.headers.get('Authorization')?.split('Bearer ')[1];

    if (!authToken) {
      return NextResponse.json(
        { error: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }

    const decodedToken = await admin.auth().verifyIdToken(authToken);
    const userId = decodedToken.uid;

    const { url, method, headers, body }: ProxyRequestBody =
      await request.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), PROXY_TIMEOUT);

    const headersToSend = { ...headers };
    delete headersToSend['host'];
    delete headersToSend['connection'];

    const options: RequestInit = {
      method,
      headers: headersToSend,
      body:
        body && (method === 'POST' || method === 'PUT' || method === 'PATCH')
          ? JSON.stringify(body)
          : undefined,
      signal: controller.signal,
    };

    const startTime = performance.now();
    const apiResponse = await fetch(url, options);
    clearTimeout(timeoutId);

    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    const responseBody = await apiResponse.text();
    const responseSize = new Blob([responseBody]).size;

    const responseData = {
      status: apiResponse.status,
      statusText: apiResponse.statusText,
      body: responseBody,
      headers: Object.fromEntries(apiResponse.headers.entries()),
      duration: duration,
      size: responseSize,
    };

    firestore
      .collection('history')
      .add({
        userId: userId,
        request: {
          method: method,
          url: url,
          headers: headers,
          body: body,
        },
        response: {
          status: responseData.status,
          size: responseData.size,
        },
        duration: responseData.duration,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      })
      .catch(console.error);

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: unknown) {
    let errorMessage = 'An unexpected server error occurred.';

    if (isFirebaseError(error)) {
      if (error.code.startsWith('auth/')) {
        return NextResponse.json(
          { error: `Unauthorized: ${error.message}` },
          { status: 401 }
        );
      }
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = `Request timed out after ${PROXY_TIMEOUT / 1000} seconds.`;
      } else {
        errorMessage = `Proxy error: ${error.message}`;
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 200 });
  }
}

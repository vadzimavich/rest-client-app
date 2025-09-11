import { NextResponse } from 'next/server';

interface ProxyRequestBody {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers: Record<string, string>;
  body?: any;
}

export async function POST(request: Request) {
  try {
    const { url, method, headers, body }: ProxyRequestBody = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // deleting headers created automatically by browser/next.js
    const headersToSend = { ...headers };
    delete headersToSend['host'];
    delete headersToSend['connection'];
    // can be added

    const options: RequestInit = {
      method,
      headers: headersToSend,
      body: body && (method === 'POST' || method === 'PUT' || method === 'PATCH')
        ? JSON.stringify(body)
        : undefined,
    };

    const apiResponse = await fetch(url, options);

    const responseBody = await apiResponse.text();

    const responseData = {
      status: apiResponse.status,
      statusText: apiResponse.statusText,
      body: responseBody,
      headers: Object.fromEntries(apiResponse.headers.entries()),
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
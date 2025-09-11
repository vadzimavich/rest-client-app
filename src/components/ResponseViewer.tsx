"use client";

interface ResponseData {
  status: number;
  statusText: string;
  body: string;
  headers: Record<string, string>;
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
      <div>
        <strong>Status:</strong> {data.status} {data.statusText}
      </div>
      <h4>Body:</h4>
      <pre style={{ background: '#f4f4f4', padding: '1rem', whiteSpace: 'pre-wrap' }}>
        <code>{formattedBody}</code>
      </pre>
    </div>
  );
}

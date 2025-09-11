"use client";

import { useState } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import ResponseViewer from "@/components/ResponseViewer";

const mockSuccessResponse = {
  status: 200,
  statusText: "OK",
  body: JSON.stringify({
    userId: 1,
    id: 1,
    title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
  }),
  headers: {
    "content-type": "application/json; charset=utf-8",
    "x-powered-by": "Express",
  },
  duration: 128,
  size: 292,
};

type ResponseData = typeof mockSuccessResponse | null;

export default function ClientPage() {
  const [responseData, setResponseData] = useState<ResponseData>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <PrivateRoute>
      <h1>REST Client Page (Test Bench)</h1>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <button onClick={() => {
          setIsLoading(true);
          setResponseData(null);
          setTimeout(() => {
            setIsLoading(false);
            setResponseData(mockSuccessResponse);
          }, 1000);
        }}>
          Simulate Successful Request
        </button>
        <button onClick={() => {
          setIsLoading(false);
          setResponseData(null);
        }}>
          Clear Response
        </button>
      </div>
      <hr />
      <ResponseViewer data={responseData} loading={isLoading} />
    </PrivateRoute>
  );
}

"use client";

import { useState } from "react";
import RequestPanel from "@/components/requestPanel/RequestPanel";
import ResponsePanel from "@/components/responsePanel/ResponsePanel";
import { RequestState } from "@/types/request";
import { ResponseData } from "@/types/response"; 
import styles from './ClientUI.module.css';

export default function ClientUI() {
  const [requestState, setRequestState] = useState<RequestState>({
    method: 'GET',
    url: '',
    body: '',
    headers: [{ id: crypto.randomUUID(), key: '', value: '' }],
  });

  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className={styles.clientContainer}>
      <h1 className={styles.title}>REST Client</h1>

      <div className={styles.panels}>
        <div className={styles.requestPanel}>
          <RequestPanel
            requestState={requestState}
            setRequestState={setRequestState}
            setResponseData={setResponseData}
            setIsLoading={setIsLoading}
            setError={setError}
            isLoading={isLoading}
          />
        </div>

        <div className={styles.responsePanel}>
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

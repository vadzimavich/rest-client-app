"use client";

import styles from './ResponsePanel.module.css';
import ResponseViewer from "@/components/responseViewer/ResponseViewer";
import { ResponseData } from "@/types/response";

interface ResponsePanelProps {
  responseData: ResponseData | null;
  loading: boolean;
  error: string | null;
}

export default function ResponsePanel({ responseData, loading, error }: ResponsePanelProps) {
  return (
    <div className={styles.responsePanel}>
      {error && <div className={styles.error}>Error: {error}</div>}
      <ResponseViewer data={responseData} loading={loading} />
    </div>
  );
}

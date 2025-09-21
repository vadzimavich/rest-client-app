'use client';

import styles from './ResponsePanel.module.css';
import { useTranslations } from 'next-intl';
import ResponseViewer from '@/components/responseViewer/ResponseViewer';
import { ResponseData } from '@/types/response';

interface ResponsePanelProps {
  responseData: ResponseData | null;
  loading: boolean;
  error: string | null;
}

export default function ResponsePanel({
  responseData,
  loading,
  error,
}: ResponsePanelProps) {
  const t = useTranslations('ClientUI');

  return (
    <div className={styles.responsePanel}>
      {error && (
        <div className={styles.error}>
          {t('unexpectedError')}:{error}
        </div>
      )}
      <ResponseViewer data={responseData} loading={loading} />
    </div>
  );
}

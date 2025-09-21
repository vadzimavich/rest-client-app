'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';
import styles from './error.module.css';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const t = useTranslations('ErrorPage');

  useEffect(() => {
    console.error(error);
    toast.error(error.message || t('toastError'), {
      duration: 4000,
    });
  }, [error, t]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t('title')}</h2>
        <button className={styles.button} onClick={reset}>
          {t('tryAgainButton')}
        </button>
      </div>
    </div>
  );
}

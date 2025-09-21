'use client';

import { Link } from '@/navigation';
import styles from './not-found.module.css';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('NotFoundPage');

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t('title')}</h2>
      <Link href="/" className={styles.link}>
        {t('backHomeLink')}
      </Link>
    </div>
  );
}

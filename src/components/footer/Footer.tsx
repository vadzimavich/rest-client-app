'use client';

import { useTranslations } from 'next-intl';
import styles from './Footer.module.css';
import Image from 'next/image';
import { Link } from '@/navigation';

export default function Footer() {
  const t = useTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.year}>{year}</div>
      <div className={styles.links}>
        <span>{t('createdBy')} </span>
        <Link
          href="https://github.com/vadzimavich"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          {t('author1Name')}
        </Link>
        <span>{t('separator')}</span>
        <Link
          href="https://github.com/tffl"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          {t('author2Name')}
        </Link>
      </div>

      <Link
        href="https://rs.school/courses/reactjs"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.logo}
      >
        <Image src="/rss-logo.svg" alt="RS School" width={40} height={40} />
      </Link>
    </footer>
  );
}

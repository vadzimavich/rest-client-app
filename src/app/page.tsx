'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import styles from './page.module.css';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const { user, loading } = useAuth();
  const t = useTranslations('HomePage');

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const clientHref = `/client?method=GET&url=${btoa('')}&body=${btoa('')}`;

  return (
    <main style={{ padding: '2rem' }}>
      <div className={styles.container}>
        {!user ? (
          <>
            <h1 className={styles.title}>{t('welcomeTitle')}</h1>
            <p className={styles.text}>
              {t.rich('welcomeText', {
                signInLink: (chunks) => (
                  <Link href="/signin" className={styles.link}>
                    {chunks}
                  </Link>
                ),
                signUpLink: (chunks) => (
                  <Link href="/signup" className={styles.link}>
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </>
        ) : (
          <>
            <h1 className={styles.title}>
              {t('welcomeBackTitle', {
                username: user.email?.split('@')[0] || 'User',
              })}
            </h1>
            <nav className={styles.nav}>
              <Link href={clientHref} className={styles.button}>
                {t('restClientButton')}
              </Link>
              <Link href="/history" className={styles.button}>
                {t('historyButton')}
              </Link>
            </nav>
          </>
        )}
      </div>
    </main>
  );
}

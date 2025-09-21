'use client';

import { Link } from '@/navigation';
import { useAuth } from '@/hooks/useAuth';
import styles from './page.module.css';
import { useTranslations } from 'next-intl';
import Spinner from '@/components/spinner/Spinner';

export default function HomePage() {
  const { user, loading } = useAuth();
  const t = useTranslations('HomePage');

  if (loading) {
    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    );
  }

  return (
    <main>
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
              <Link href="/client" className={styles.button}>
                {t('restClientButton')}
              </Link>
              <Link href="/history" className={styles.button}>
                {t('historyButton')}
              </Link>
              <Link href="/variables" className={styles.button}>
                {t('variablesButton')}
              </Link>
            </nav>
          </>
        )}
      </div>
    </main>
  );
}

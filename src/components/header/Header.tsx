'use client';

import { Link, useRouter } from '@/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useAuth } from '@/hooks/useAuth';
import styles from './Header.module.css';
import LangToggle from '@/components/langToggle/LangToggle';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export default function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const t = useTranslations('Header');
  const [scrolled, setScrolled] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await fetch('/api/auth/session', { method: 'DELETE' });

      router.push('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <Link href="/" className={styles.link}>
        {t('appTitle')}
      </Link>

      <nav className={styles.nav}>
        <LangToggle />

        {loading ? (
          <div>{t('loading')}</div>
        ) : user ? (
          <>
            <span>
              {t('welcome', { email: user.email?.split('@')[0] || 'User' })}
            </span>
            <button onClick={handleSignOut} className={styles.button}>
              {t('signOut')}
            </button>
          </>
        ) : (
          <>
            <Link href="/signin" className={styles.link}>
              {t('signIn')}
            </Link>
            <Link href="/signup" className={styles.link}>
              {t('signUp')}
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

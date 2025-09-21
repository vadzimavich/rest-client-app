'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from '@/navigation';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '../spinner/Spinner';
import styles from './PrivateRoute.module.css';

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner />
      </div>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  return null;
}

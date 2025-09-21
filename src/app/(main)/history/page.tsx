import Link from 'next/link';
import { cookies } from 'next/headers';
import admin from 'firebase-admin';
import { firestore } from '@/lib/firebase/admin';
import { HistoryItem } from '@/types/request';
import PrivateRoute from '@/components/PrivateRoute';
import styles from './historyPage.module.css';

const safeEncode = (str: unknown): string => {
  if (!str) return '';
  try {
    const stringified = typeof str === 'string' ? str : JSON.stringify(str);
    return btoa(stringified);
  } catch (e) {
    return '';
  }
};

async function getHistoryForUser(): Promise<HistoryItem[]> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) return [];

    const decodedToken = await admin.auth().verifySessionCookie(sessionCookie);
    const userId = decodedToken.uid;

    const historySnapshot = await firestore
      .collection('history')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();

    if (historySnapshot.empty) return [];

    const history: HistoryItem[] = historySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as HistoryItem));

    return history;
  } catch (error) {
    console.error('Failed to fetch history:', error);
    return [];
  }
}

export default async function HistoryPage() {
  const historyItems = await getHistoryForUser();

  return (
    <PrivateRoute>
      <div className={styles.container}>
        <h1 className={styles.title}>History</h1>
        {historyItems.length === 0 ? (
          <div>
            <p>You haven&apos;t executed any requests yet.</p>
            <Link href="/client" className={styles.link}>Go to REST Client</Link>
          </div>
        ) : (
          <ul className={styles.historyList}>
            {historyItems.map((item) => {
              const params = new URLSearchParams();
              params.set('method', item.request.method);
              params.set('url', safeEncode(item.request.url));
              params.set('body', safeEncode(item.request.body));

              Object.entries(item.request.headers).forEach(([key, value]) => {
                params.set(key, value);
              });

              const href = `/client?${params.toString()}`;

              return (
                <li key={item.id} className={styles.historyItem}>
                  <Link href={href} className={styles.link}>
                    <span className={styles.method}>{item.request.method}</span>
                    <span>{item.request.url}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </PrivateRoute>
  );
}
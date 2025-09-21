import Link from 'next/link';
import { cookies } from 'next/headers';
import admin from 'firebase-admin';
import { firestore } from '@/lib/firebase/admin';
import { HistoryItem } from '@/types/request';
import PrivateRoute from '@/components/PrivateRoute';
import { getTranslations } from 'next-intl/server';

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
    // get token
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) {
      return [];
    }

    // verify
    const decodedToken = await admin.auth().verifySessionCookie(sessionCookie);
    const userId = decodedToken.uid;

    // firestore
    const historySnapshot = await firestore
      .collection('history')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(50) // last 50 requests
      .get();

    if (historySnapshot.empty) {
      return [];
    }

    // convert data
    const history: HistoryItem[] = historySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      } as HistoryItem;
    });

    return history;
  } catch (error) {
    console.error('Failed to fetch history:', error);
    return [];
  }
}

export default async function HistoryPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'HistoryPage' });
  const historyItems = await getHistoryForUser();

  return (
    <PrivateRoute>
      <h1>{t('title')}</h1>
      {historyItems.length === 0 ? (
        <div>
          <p>{t('emptyMessage')}</p>
          <Link href="/client">{t('linkToClient')}</Link>
        </div>
      ) : (
        <ul style={{ listStyle: 'none', marginTop: '1rem' }}>
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
              <li key={item.id} style={{ marginBottom: '0.5rem' }}>
                <Link href={href}>
                  <span style={{ fontWeight: 'bold', marginRight: '1rem' }}>
                    {item.request.method}
                  </span>
                  <span>{item.request.url}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </PrivateRoute>
  );
}

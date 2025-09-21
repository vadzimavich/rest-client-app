import { Link } from '@/navigation';
import { cookies } from 'next/headers';
import admin from 'firebase-admin';
import { firestore } from '@/lib/firebase/admin';
import { HistoryItem } from '@/types/request';
import PrivateRoute from '@/components/PrivateRoute';
import styles from './historyPage.module.css';
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
    const REQUEST_LIMIT = 50;

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) {
      return [];
    }

    const decodedToken = await admin.auth().verifySessionCookie(sessionCookie);
    const userId = decodedToken.uid;

    const historySnapshot = await firestore
      .collection('history')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(REQUEST_LIMIT)
      .get();

    if (historySnapshot.empty) {
      return [];
    }

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
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'HistoryPage' });
  const historyItems = await getHistoryForUser();

  return (
    <PrivateRoute>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('title')}</h1>

        {historyItems.length === 0 ? (
          <div className={styles.empty}>
            <p>{t('emptyMessage')}</p>
            <Link href="/client" className={styles.link}>
              {t('linkToClient')}
            </Link>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('tableHeaderMethod')}</th>
                <th>{t('tableHeaderURL')}</th>
                <th>{t('tableHeaderStatus')}</th>
                <th>{t('tableHeaderReqSize')}</th>
                <th>{t('tableHeaderRespSize')}</th>
                <th>{t('tableHeaderDuration')}</th>
                <th>{t('tableHeaderTimestamp')}</th>
                <th>{t('tableHeaderError')}</th>
              </tr>
            </thead>
            <tbody>
              {historyItems.map((item) => {
                const params = new URLSearchParams();
                params.set('method', item.request.method);
                params.set('url', safeEncode(item.request.url));
                params.set('body', safeEncode(item.request.body));

                Object.entries(item.request.headers).forEach(([key, value]) => {
                  params.set(key, value);
                });

                const href = `/client?${params.toString()}`;

                const date = new Date(
                  item.timestamp._seconds * 1000
                ).toLocaleString();

                const statusClass =
                  item.response.status >= 200 && item.response.status < 300
                    ? styles.success
                    : item.response.status >= 400 && item.response.status < 500
                      ? styles.clientError
                      : styles.serverError;

                return (
                  <tr key={item.id}>
                    <td>{item.request.method}</td>
                    <td>
                      <Link href={href} className={styles.link}>
                        {item.request.url}
                      </Link>
                    </td>
                    <td className={`${styles.status} ${statusClass}`}>
                      {item.response.status}
                    </td>
                    <td>
                      {item.request.body
                        ? new Blob([JSON.stringify(item.request.body)]).size
                        : 0}
                    </td>
                    <td>{item.response.size}</td>
                    <td>{item.duration}</td>
                    <td>{date}</td>
                    <td>{item.error || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </PrivateRoute>
  );
}

import admin from 'firebase-admin';
import { getApps, ServiceAccount } from 'firebase-admin/app';

if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not set.');
}

const serviceAccount: ServiceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY
);

if (getApps().length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const firestore = admin.firestore();
export { firestore };

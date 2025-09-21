import admin from 'firebase-admin';
import { getApps, ServiceAccount } from 'firebase-admin/app';
import serviceAccountJson from '../../../serviceAccountKey.json' with { type: 'json' };

const serviceAccount = serviceAccountJson as ServiceAccount;

if (getApps().length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const firestore = admin.firestore();
export { firestore };

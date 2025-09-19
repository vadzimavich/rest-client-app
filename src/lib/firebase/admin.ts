import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

const serviceAccount = require('../../../serviceAccountKey.json');

if (getApps().length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const firestore = admin.firestore();
export { firestore };

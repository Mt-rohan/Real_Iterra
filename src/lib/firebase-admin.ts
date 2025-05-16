import * as admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const adminDB = admin.firestore();
export const adminAuth = admin.auth();
export const adminFieldValue = admin.firestore.FieldValue;

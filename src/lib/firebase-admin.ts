import * as admin from "firebase-admin";

if (!admin.apps.length) {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY!;
  const serviceAccount = JSON.parse(raw);

  // Fix for local: replace escaped newlines with real newlines
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const adminDB = admin.firestore();
export const adminAuth = admin.auth();
export const adminFieldValue = admin.firestore.FieldValue;

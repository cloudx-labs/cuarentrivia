import * as firebaseAdmin from 'firebase-admin';

export const initFirebase = () => {
  firebaseAdmin.initializeApp();
};

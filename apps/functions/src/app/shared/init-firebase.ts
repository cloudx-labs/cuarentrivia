import * as admin from 'firebase-admin';

export const initFirebase = () => {
  admin.initializeApp();
};

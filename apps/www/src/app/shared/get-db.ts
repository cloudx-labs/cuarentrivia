import firebase from 'firebase/compat/app';

export const getDb = (): firebase.firestore.Firestore => firebase.firestore();

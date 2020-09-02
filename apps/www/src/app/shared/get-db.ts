import firebase from 'firebase/app';

export const getDb = (): firebase.firestore.Firestore => firebase.firestore();

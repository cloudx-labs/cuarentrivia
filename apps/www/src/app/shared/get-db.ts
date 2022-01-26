import { Firestore, getFirestore } from 'firebase/firestore';

export const getDb = (): Firestore => getFirestore();

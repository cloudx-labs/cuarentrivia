import { GoogleAuthProvider } from 'firebase/auth';

export const environment = {
  production: true,
  firebase: {
    apiKey: process.env['NX_FIREBASE_APP_API_KEY'],
    authDomain: process.env['NX_FIREBASE_APP_AUTH_DOMAIN'],
    // databaseURL: process.env['NX_FIREBASE_APP_DATABASE_URL]
    projectId: process.env['NX_FIREBASE_APP_PROJECT_ID'],
    storageBucket: process.env['NX_FIREBASE_APP_STORAGE_BUCKET'],
    messagingSenderId: process.env['NX_FIREBASE_APP_MESSAGING_SENDER_ID'],
    appId: process.env['NX_FIREBASE_APP_APP_ID'],
    measurementId: process.env['NX_FIREBASE_APP_MEASUREMENT_ID'],
  },
  firebaseUi: {
    signInOptions: [
      {
        provider: GoogleAuthProvider.PROVIDER_ID,
        scopes: [],
        customParameters: {
          hd: 'cloudx.com',
        },
      },
    ],
  },
};

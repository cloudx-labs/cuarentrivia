// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.

export const environment = {
  production: false,
  firebase: {
    apiKey: process.env.FIREBASE_APP_API_KEY,
    authDomain: process.env.FIREBASE_APP_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_APP_DATABASE_URL,
    projectId: process.env.FIREBASE_APP_PROJECT_ID,
    storageBucket: process.env.FIREBASE_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_APP_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_MESSAGING_APP_ID,
    measurementId: process.env.FIREBASE_APP_MEASUREMENT_ID,
  },
};

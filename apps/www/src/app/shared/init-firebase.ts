import firebase from 'firebase/compat/app';
import 'firebase/compat/analytics';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/functions';
import 'firebase/compat/storage';
import { environment } from '../../environments/environment';

const initFirebase = () => {
  firebase.initializeApp(environment.firebase);
};

export default initFirebase;

import * as firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
import { environment } from '../../environments/environment';

const initFirebase = () => {
  firebase.initializeApp(environment.firebase);
};

export default initFirebase;

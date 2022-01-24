import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

const initFirebase = () => initializeApp(environment.firebase);

export default initFirebase;

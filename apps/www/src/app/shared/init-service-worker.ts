import { Workbox } from 'workbox-window';
import { environment } from '../../environments/environment';

/** TODO
 * Fix errors encountered on production serve:
 *  - `Uncaught FirebaseError: Firebase: Error (auth/invalid-api-key).` (<Authenticate>).
 *  - [webpack-dev-server] warnings.
 *  - `Uncaught (in promise) TypeError: ServiceWorker script at http://localhost:4200/sw.js for scope http://localhost:4200/ encountered an error during installation.`
 *  - WARNING in DefinePlugin -> Conflicting values for 'process.env.NODE_ENV' (Terminal server).
 */
const initServiceWorker = () => {
  if ('serviceWorker' in navigator && environment.production) {
    const wb = new Workbox('/sw.js');

    wb.register();
  }
};

export default initServiceWorker;

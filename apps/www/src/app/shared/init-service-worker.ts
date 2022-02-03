import { Workbox } from 'workbox-window';
import { environment } from '../../environments/environment';

const initServiceWorker = () => {
  if ('serviceWorker' in navigator && environment.production) {
    const wb = new Workbox('/sw.js');

    wb.register();
  }
};

export default initServiceWorker;

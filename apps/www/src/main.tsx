import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import initFirebase from './app/shared/init-firebase';
import App from './app/app';
import { buildMaterialTheme } from './app/shared/build-material-theme';
import initServiceWorker from './app/shared/init-service-worker';
import { ThemeProvider } from '@mui/material';

initServiceWorker();
initFirebase();
const theme = buildMaterialTheme();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>
);

import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import initFirebase from './app/shared/init-firebase';
import App from './app/app';
import buildMaterialTheme from './app/shared/build-material-theme';
import initServiceWorker from './app/shared/init-service-worker';

initServiceWorker();
initFirebase();
const theme = buildMaterialTheme();

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

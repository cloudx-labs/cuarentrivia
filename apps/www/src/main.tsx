import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import App from './app/app';
import buildMaterialTheme from './app/shared/build-material-theme';

const theme = buildMaterialTheme();

ReactDOM.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
  document.getElementById('root')
);

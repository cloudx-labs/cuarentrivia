import { createTheme } from '@mui/material/styles';

export const buildMaterialTheme = () =>
  createTheme({
    typography: { fontFamily: `"Montserrat Alternates", sans-serif` },
    palette: {
      primary: {
        light: '#f7decd',
        main: '#ff6600',
        dark: '#ff6600',
        contrastText: '#ffffff',
      },
      secondary: {
        light: '#ffffff',
        main: '#ffffff',
        dark: '#ffffff',
        contrastText: '#3b4244',
      },
    },
  });

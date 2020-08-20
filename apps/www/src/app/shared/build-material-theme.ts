import { createMuiTheme } from '@material-ui/core/styles';

const buildMaterialTheme = () => {
  const theme = createMuiTheme({
    typography: { fontFamily: `"Montserrat Alternates", sans-serif` },
    palette: {
      primary: {
        light: '#ff6600',
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

  return theme;
};

export default buildMaterialTheme;

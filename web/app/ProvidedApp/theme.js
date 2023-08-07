import {experimental_extendTheme as extendTheme} from '@mui/material/styles';

export const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#475CF6',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#919DFA',
          contrastText: '#030A3C',
        },
        background: {
          default: '#18171c',
        },
        text: {
          primary: '#e9e8f1',
          secondary: '#beb9d4',
          prominent: '#faf8ff',
        },
        action: {
          disabledBackground: '#474554',
        },
      },
    },
  },

  typography: {
    h1: {
      fontSize: '3rem',
      fontWeight: 900,
      lineHeight: '61px',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: '46px',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 400,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 700,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: '2rem',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontSize: '1rem',
    },
  },

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        root: {
          color: '#937b5e',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {},
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: ({theme}) => ({
          color: theme.palette.text.primary,
        }),
      },
    },
  },
});

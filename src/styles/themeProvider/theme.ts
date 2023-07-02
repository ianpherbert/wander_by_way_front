import {createTheme, ThemeOptions} from "@mui/material";

const themeOptions: ThemeOptions = {
    palette: {
        primary: {
            main: '#d9763f',
        },
        secondary: {
            main: '#F3DDA9',
        },
        info: {
            main: '#507e7f',
        },
    },
    typography: {
        fontFamily: 'Duru Sans',
        h1: {
            fontFamily: 'Zen Antique',
        },
        h2: {
            fontFamily: 'Zen Antique',
        },
        h3: {
            fontFamily: 'Zen Antique',
        },
        h4: {
            fontFamily: 'Zen Antique',
        },
        h5: {
            fontFamily: 'Zen Antique',
        },
        h6: {
            fontFamily: 'Zen Antique',
        },
        subtitle1: {
            fontFamily: 'Duru Sans',
        },
        button: {
            fontFamily: 'Zen Antique',
            fontWeight: 700,
            lineHeight: 1.67,
            fontSize: '1rem',
        },
        fontSize: 16,
    },
};

export const theme = createTheme(themeOptions);
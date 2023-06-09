import {theme} from "styles/themeProvider/theme";

export const welcomeCardStyle = {
    width: "80vw",
    maxWidth: "1500px",
    height: "400px",
    borderRadius: "11px",
    backgroundColor: theme.palette.primary.main,
    position: "relative",
    boxShadow: "5px 5px 15px -2px rgba(58, 57, 57, 0.89)",
    backgroundImage: `url(${process.env.PUBLIC_URL + '/graphics/man.png'})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPositionY: "-60px",
    display: "flex",
};

export const welcomeGridStyle = {
    margin: "50px"
};
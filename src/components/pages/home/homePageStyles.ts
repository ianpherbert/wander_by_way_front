import {theme} from "styles/themeProvider/theme";
import {publicImage} from "../../../utils/publicImage";

export const homePageContainerStyle = {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap"
};
export const welcomeCardStyle = {
    width: "100%",
    maxWidth: "1500px",
    height: "400px",
    borderRadius: "11px",
    backgroundColor: theme.palette.primary.main,
    position: "relative",
    boxShadow: "5px 5px 15px -2px rgba(58, 57, 57, 0.89)",
    backgroundImage: publicImage('/graphics/man.png'),
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPositionY: "-60px",
    display: "flex",
};

export const welcomeGridStyle = {
    margin: "50px"
};

export const mapContainerStyle = {
    marginTop: "50px",
    width: "90vw",
    maxWidth: "1500px",
};
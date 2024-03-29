import {theme} from "../../../styles/themeProvider/theme";
import {publicImage} from "../../../utils/publicImage";

export const mapStyle = {
    navigationWrapper: {
        width: "100%",
        backgroundColor: theme.palette.secondary.main,
        backgroundImage: publicImage('/graphics/train_station.png'),
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        borderRadius: "11px",
        padding: "25px 0 25px 0",
    },
    wrapper: {
        position: "relative",
        height: "80vh",
        width: "95%",
        padding: "10px",
        margin: "10px auto",
        display: "flex",
        alignItems: "center",
    },
};
import {theme} from "../../../styles/themeProvider/theme";
import {publicImage} from "../../../utils/publicImage";

export const mapWrapperStyle = {
    position: "relative",
    height: "80vh",
    width: "100%",
    padding: "10px",
    margin: "10px auto auto auto",
    display: "flex",
    alignItems: "center",
};

export const navigationStyle = {
    minHeight: "50px",
    borderRadius: "5px",
    backgroundColor: theme.palette.primary.main,
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexWrap: "wrap",
    overflow: "hidden",
    padding: "5px",
    backgroundImage: publicImage('/graphics/street.png'),
    backgroundPositionY: "-450px",
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
};

export const routePreviewStyle = {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "stretch",
    alignItems: "center",
    overflowX: "auto",
    padding: "0px 10px 0px 10px",
    flex: "1",
    margin: "5px",
    flexWrap: "no-wrap",
};

export const routePreviewItemWrapper = {
    flexWrap: "wrap",
    minWidth: "140px",
    display: "flex",
    position: "relative",
    overflow: "hidden",
    margin: "0 5px 0 px"
};

export const routePreviewItem = {
    height: "50px",
    backgroundColor: "white",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    minWidth: "150px",
    cursor: "pointer",
    padding: "5px",
    margin: "0 5px 0 px"
};
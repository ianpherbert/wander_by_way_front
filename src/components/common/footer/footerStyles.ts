import {theme} from "../../../styles/themeProvider/theme";
import {lighten} from "@mui/material";

export const footerStyle = {
    minHeight: "10vh",
    width: "100%",
    margin: "auto",
    backgroundColor: lighten(theme.palette.primary.main, .1)
};
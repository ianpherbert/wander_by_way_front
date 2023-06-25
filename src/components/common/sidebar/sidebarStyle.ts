import {theme} from "../../../styles/themeProvider/theme";

export const sidebarStyle = {
    backgroundColor: theme.palette.primary.main,
    width: "50px",
    position: "fixed",
    top: "0",
    bottom: "0",
    left: "0",
    transition: "ease-in-out .3s",
    cursor: "pointer",
    zIndex: "15",
    boxShadow: "3px 3px 15px -2px rgba(139,190,178,0.68)",
    "&:hover": {
        width: "200px",
        boxShadow: "3px 3px 30px -2px rgba(139,190,178,0.68)",
    }
};
import React from "react";
import {Languages} from "../../../utils/Languages";
import {Box, Grid, Link, Typography} from "@mui/material";
import {headerStyle} from "./headerStyle";

interface HeaderProps {
    connected: boolean,
    username?: string,
    language: Languages
}

const Header = ({language}: HeaderProps) => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const flagLink = language == Languages.FR ? "/languageIcons/FR.png" : "/languageIcons/EN.png";

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function redirectLogin() {
        window.location.replace("/login");
    }

    return (
        <header>
            <Box sx={headerStyle.header}>
                <Grid container>
                    <Grid item xs={6}>
                        <Link href={"/"} underline="none" sx={{color: "black"}}>
                            <Typography variant="h3" component="h1">Wander By Way</Typography>
                        </Link>
                    </Grid>
                    <Grid container item xs={2} justifyContent="space-evenly"
                        alignItems="center">
                        {/*<Grid sx={headerStyle.links.connectionGrid}*/}
                        {/*    justifyContent="center" item xs={6}>*/}
                        {/*    <Chip icon={<PermIdentity/>}*/}
                        {/*        label={connected ? username || "Your account" : "Log In"}*/}
                        {/*        onClick={redirectLogin}/>*/}
                        {/*</Grid>*/}
                        {/*<Grid xs={6} sx={headerStyle.links.languageGrid} item*/}
                        {/*    justifyContent="center">*/}
                        {/*    <Link href={"#"}>*/}
                        {/*        <Avatar src={flagLink}*/}
                        {/*            alt={language == Languages.FR ? "drapeau français" : "british flag"}/>*/}
                        {/*    </Link>*/}
                        {/*</Grid>*/}
                    </Grid>
                </Grid>
            </Box>
        </header>
    );
};

export default Header;

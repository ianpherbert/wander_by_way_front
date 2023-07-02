import React from 'react';
import "./styles/icofont/icofont.min.css";
import Header from "./components/common/header";
import {Languages} from "./utils/Languages";
import {CookieConsentObject} from "./components/cookies/CookieConstent";
import {Box, Grid} from "@mui/material";
import {Outlet} from "react-router-dom";

const bodyStyle = {
    margin: "2rem auto auto auto",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    width: "95vw"
};

function App() {

    return (
        <>
            <CookieConsentObject/>
            <Grid>
                <Grid item xs={12}>
                    <Header language={Languages.EN} connected={false}/>
                </Grid>
                <Grid xs={12}>
                    <Box
                        sx={bodyStyle}>
                        <Outlet/>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}

export default App;

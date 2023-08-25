import React from 'react';
import "./styles/icofont/icofont.min.css";
import Header from "./components/common/header";
import {Languages} from "./utils/Languages";
import {CookieConsentObject} from "./components/cookies/CookieConstent";
import {Box, Grid} from "@mui/material";
import {Outlet} from "react-router-dom";
import Footer from "./components/footer";

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
            <Grid sx={{minHeight: "95vh", marginBottom: "5vh"}}>
                <Grid item xs={12}>
                    <Header language={Languages.EN} connected={false}/>
                </Grid>
                <Grid item xs={12}>
                    <Box
                        sx={bodyStyle}>
                        <Outlet/>
                    </Box>
                </Grid>
            </Grid>
            <Footer/>
        </>
    );
}

export default App;

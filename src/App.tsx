import React from 'react';
import "./styles/icofont/icofont.min.css";
import Header from "./components/common/header";
import Body from "./components/common/body";
import {Languages} from "./utils/Languages";
import {CookieConsentObject} from "./components/cookies/CookieConstent";
import {Grid} from "@mui/material";


function App() {

    return (
        <>
            <CookieConsentObject/>
            <Grid>
                <Grid item xs={12}>
                    <Header language={Languages.EN} connected={false}/>
                </Grid>
                <Grid xs={12}>
                    <Body/>
                </Grid>
            </Grid>
        </>
    );
}

export default App;

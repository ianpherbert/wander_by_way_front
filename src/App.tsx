import React from 'react';
import './App.css';
import "./styles/icofont/icofont.min.css";
import Sidebar from "./components/common/sidebar";
import Header from "./components/common/header";
import Body from "./components/common/body";
import {Languages} from "./utils/Languages";
import {CookieConsentObject} from "./components/cookies/CookieConstent";


function App() {

    return (
        <>
            <CookieConsentObject/>
            <Sidebar/>
            <Header language={Languages.EN} connected={false}/>
            <Body/>
        </>
    );
}

export default App;

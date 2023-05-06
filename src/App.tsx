import React from 'react';
import './App.css';
import "./styles/icofont/icofont.min.css";
import Sidebar from "./components/common/sidebar";
import Header from "./components/common/header";
import Body from "./components/common/body";
import {Languages} from "./utils/Languages";

function App() {

    return (
        <body>
            <Sidebar/>
            <Header language={Languages.EN} connected={false}/>
            <Body/>
        </body>
    );
}

export default App;

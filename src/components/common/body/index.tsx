import React from "react";
import "./index.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "../../pages/home";
import RouteFinder from "../../pages/routeFinder";
import LoginPage from "../../pages/login";
import SignUpPage from "../../pages/signup";


const Body = () => {
    return (
        <div id={"body"}>
            <Router>
                <Routes>
                    <Route path="*" element={<HomePage/>} />
                    <Route path="/home" element={<HomePage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path={"/signup"} element={<SignUpPage/>}/>
                    <Route path={"/routeFinder"} element={<RouteFinder/>}/>
                    <Route path="/test" element={<h1>Test</h1>} />
                </Routes>
            </Router>
        </div>
    )
}

export default Body

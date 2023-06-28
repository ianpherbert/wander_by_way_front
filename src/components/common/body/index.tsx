import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import HomePage from "../../pages/home";
import RouteFinder from "../../pages/routeFinder";
import LoginPage from "../../pages/login";
import SignUpPage from "../../pages/signup";
import {Box} from "@mui/material";
import {bodyStyle} from "./bodyStyle";


const Body = () => {
    return (
        <Box
            sx={bodyStyle}>
            <Router>
                <Routes>
                    <Route path="*" element={<HomePage/>}/>
                    <Route path="/home" element={<HomePage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path={"/signup"} element={<SignUpPage/>}/>
                    <Route path={"/routeFinder/:fromId/:toId"} element={<RouteFinder/>}/>
                    <Route path="/test" element={<h1>Test</h1>}/>
                </Routes>
            </Router>
        </Box>
    );
};

export default Body;

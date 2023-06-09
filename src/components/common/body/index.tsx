import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import HomePage from "../../pages/home";
import RouteFinder from "../../pages/routeFinder";
import LoginPage from "../../pages/login";
import SignUpPage from "../../pages/signup";
import {Container} from "@mui/material";


const Body = () => {
    return (
        <Container
            sx={{display: "flex", alignItems: "center", flexWrap: "wrap", marginTop: "150px"}} maxWidth={false}>
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
        </Container>
    );
};

export default Body;

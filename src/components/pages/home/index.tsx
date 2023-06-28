import React from "react";
import WelcomeCard from "./welcomeCard";
import HomePageMap from "./HomePageMap";
import {Container} from "@mui/material";

const HomePage = () => {

    return (
        <Container
            sx={{display: "flex", alignItems: "center", flexWrap: "wrap"}}>
            <WelcomeCard/>
            <HomePageMap/>
        </Container>
    );
};

export default HomePage;

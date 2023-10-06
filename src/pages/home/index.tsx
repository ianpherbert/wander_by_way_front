import React from "react";
import WelcomeCard from "./welcomeCard";
import HomePageMap from "./HomePageMap";
import {Container} from "@mui/material";
import {homePageContainerStyle} from "./homePageStyles";

const HomePage = () => {

    return (
        <Container
            sx={homePageContainerStyle}>
            <WelcomeCard/>
            <HomePageMap/>
        </Container>
    );
};

export default HomePage;

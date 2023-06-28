import React, {useEffect, useState} from "react";
import {randomHello} from "../../../utils/randomHello";
import {Box, Grid, Typography} from "@mui/material";
import {welcomeCardStyle, welcomeGridStyle} from "./homePageStyles";

const WelcomeCard = () => {
    const [hello, setHello] = useState<string>(randomHello());

    useEffect(() => {
        setInterval(() => {
            setHello(randomHello());
        }, 5000);
    }, []);


    const text = "Welcome to Wander by Way, your ultimate travel planning tool. Discover new and exciting destinations\n" +
        "with our comprehensive route planner. Find all available transportation options, including trains,\n" +
        "planes, buses, and ferries, from your starting city. Create personalized routes that take you off\n" +
        "the beaten path and explore the world in a whole new way. Our site is designed to be a helpful\n" +
        "resource in your travel planning, providing you with all the information you need to plan your next\n" +
        "adventure.";

    return (
        <Box sx={welcomeCardStyle} component={"div"}>
            <Grid container sx={welcomeGridStyle}>
                <Grid xs={12}><Typography variant={"h3"}>{hello},</Typography></Grid>
                <Grid item xs={6}>
                    <Typography>{text}</Typography>
                </Grid>
            </Grid>
        </Box>


    );
};

export default WelcomeCard;

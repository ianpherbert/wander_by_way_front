import React from "react";
import {footerStyle} from "./footerStyles";
import {Box, Divider, Grid, Link, Typography} from "@mui/material";

const Footer = () => {
    return <footer style={footerStyle}>
        <Grid container justifyContent={"center"} padding={"1rem"}>
            <Grid item xs={3} textAlign={"center"}>
                <img src={"/logo192.png"} alt={"wander by way logo"}/>
                <div>
                    <Typography variant={"caption"}>Wander by Way ©2023</Typography>
                </div>
            </Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs={3}>
                <Box>
                    <Typography>Contact Us:</Typography>
                    <Divider/>
                    <Link underline="hover" color={"info"}
                        href={"mailto:hello@wanderbyway.com"}>hello@wanderbyway.com</Link>
                </Box>
                <Box marginTop={"2rem"}>
                    <Typography>Help us keep this project going:</Typography>
                    <Divider/>
                    <Link underline="hover" color={"info"}
                        href={"https://bmc.link/ianpatrickherbert"}>Buy me a coffee</Link>
                </Box>
            </Grid>
        </Grid>
    </footer>;
};

export default Footer;
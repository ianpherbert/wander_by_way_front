import React from "react";
import {useLocation} from "react-router-dom";
import {Container, Grid, Link, Typography} from "@mui/material";

const containerStyle = {
    alignItems: "center",
    justifyContent: "center",
    width: "50vw",
    textAlign: "center",
    marginTop: "3rem"
};

const imageStyle = {
    height: "25rem",
    cursor: "pointer"
};
const ErrorElement = () => {
    const location = useLocation();

    return (
        <Container sx={containerStyle}>
            <Grid container>
                <Grid xs={12}>
                    <Typography variant={"h3"}>You&apos;ve ventured off the map!</Typography>
                </Grid>
                <Grid xs={12}>
                    <Typography variant={"h1"}>Error 404</Typography>
                </Grid>
                <Grid xs={12}>
                    <Link href={"/home"}>
                        <img alt="man and woman lost sitting on the ground" style={imageStyle}
                            src={"/graphics/couple_lost.png"}/>
                    </Link>

                </Grid>
                <Grid xs={12}>
                    <Typography variant={"subtitle1"}>
                        This is where the sidewalk ends, the road less traveled, the Bermuda triangle of our
                        website. <strong>{location.pathname}</strong> has been lost, moved, or never existed at
                        all.</Typography>
                </Grid>
                <Grid xs={12}>
                    <Link href={"/home"}
                        variant="h5">
                        Go Home
                    </Link>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ErrorElement;
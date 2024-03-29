import React from "react";
import {CircularProgress, Container} from "@mui/material";
import {loaderContainerStyle} from "./loaderStyle";

const Loader = () => {

    return (
        <Container sx={loaderContainerStyle}>
            <CircularProgress color={"success"}/>
        </Container>
    );
};

export default Loader;

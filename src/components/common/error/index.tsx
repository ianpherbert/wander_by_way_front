import React from "react";
import {useLocation} from "react-router-dom";
import {Container} from "@mui/material";

const ErrorElement = () => {
    const location = useLocation();

    return (
        <Container>
            Current URL: {location.pathname}
        </Container>
    );
};

export default ErrorElement;
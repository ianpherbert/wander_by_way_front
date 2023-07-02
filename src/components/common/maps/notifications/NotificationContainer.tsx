import React from "react";
import {MapNotification} from "./MapNotification";
import {Alert, Box} from "@mui/material";

interface NotificationContainerProps {
    notifications?: MapNotification[]
}

const containerStyle = {
    position: "absolute",
    right: "1rem",
    bottom: "1rem"
};

const NotificationContainer = ({notifications}: NotificationContainerProps) => {
    return (
        <Box sx={containerStyle}>
            {notifications?.map(({severity, id, text}) =>
                <Alert key={id} severity={severity}>{text}</Alert>
            )}
        </Box>
    );
};

export default NotificationContainer;
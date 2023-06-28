import React, {useMemo, useState} from "react";
import {Stop} from "../../../../core/trip/Stop";
import {Box, Grid, Tooltip} from "@mui/material";
import {routePreviewItem, routePreviewItemWrapper} from "../routeFinderStyle";
import ConfirmDialog from "../../../common/dialog/ConfirmDialog";

interface TripOverviewItemProps {
    stop: Stop,
    restart: (stop: Stop) => void
}

const TripOverviewItem = ({stop, restart}: TripOverviewItemProps) => {
    const [startOverDialog, setStartOverDialog] = useState<boolean>(false);

    const icon = useMemo(() => {
        if (stop.origin) {
            return <i className="icofont-google-map"/>;
        } else if (stop.destination) {
            return <i className="icofont-racing-flag"/>;
        }
        return <i className="icofont-google-map"/>;

    }, [stop]);

    function openDialog() {
        setStartOverDialog(true);
    }

    function closeDialog() {
        setStartOverDialog(false);
    }

    function startOver() {
        restart(stop);
    }

    return (
        <Box sx={routePreviewItemWrapper}>
            <ConfirmDialog open={startOverDialog} body={`Are you sure you want to start over at ${stop.name}?`}
                onConfirm={startOver}
                onClose={closeDialog}/>
            <Tooltip title={stop.destination ? "Your destination" : "Start over here"}>
                <Grid style={routePreviewItem} spacing={2} onClick={openDialog}>
                    <Grid xs={5}>{icon}</Grid>
                    <Grid xs={5}><h4>{stop.name || "Anywhere"}</h4></Grid>
                </Grid>
            </Tooltip>
        </Box>
    );
};

export default TripOverviewItem;
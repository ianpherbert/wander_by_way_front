import {Trip, TripPoint, useRoutePlannerContext} from "../../pages/RoutePlanner/RoutePlannerPage";
import {Card, IconButton, Stack, Typography} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {LocationOn, Visibility, VisibilityOff} from "@mui/icons-material";
import {TransitIcon} from "../../utils/mapTripIcons";
import {formatTime} from "../../utils/timeFormatter";
import {grey} from "@mui/material/colors";


function TransitLogo({trip}: { trip: Trip }) {
    return (
        <Stack direction="row" m="auto">
            <TransitIcon type={trip.routeType}/>
            <Typography>{trip.durationTotal ? formatTime(trip.durationTotal) : ""}</Typography>
        </Stack>
    );
}

function TripOverviewItem({
    item,
}: { item: TripPoint }) {

    return (
        <>
            <Card sx={styles.card}>
                <Stack direction="row" spacing={0.5} justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}>{item.name}</Typography>

                    {item.trip && <TransitLogo trip={item.trip}/>}
                </Stack>
            </Card>

        </>
    );
}

export default function TripOverview() {
    const {trip} = useRoutePlannerContext();

    const [open, setOpen] = useState(false);

    // This is a band-aid. The map needs to be initialised in the full size. The initial state needs to be false and then change to true.
    // Also gives a nice little animation
    useEffect(() => setOpen(true), []);

    const origin = useMemo(() => trip.find(it => it.origin), [trip]);

    const tripPoints = useMemo(() => trip.filter(it => !it.origin && !it.destination), [trip]);

    return (
        <>
            <Card sx={[{flex: open ? 1 : 0}, styles.wrapper]}>
                <Stack justifyContent="center">
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mx={1}>
                        <Typography>Your Trip</Typography>
                        <IconButton
                            onClick={() => setOpen(!open)}
                            sx={{position: open ? "relative" : "absolute", zIndex: 3000, m: 1}}
                        >
                            {open ? <VisibilityOff/> : <Visibility/>}
                        </IconButton>
                    </Stack>
                    <Stack direction="row" m="auto">
                        <LocationOn/>
                        <Typography>{origin?.name}</Typography>
                    </Stack>
                    <Stack sx={styles.overview} justifyItems="stretch">
                        {tripPoints.map(it => <TripOverviewItem item={it} key={it.name}/>)}
                    </Stack>
                </Stack>
            </Card>
        </>
    );
}

const styles = {
    wrapper: {
        transition: ".3s",
        backgroundColor: grey[50],
    },
    overview: {
        overflowY: "auto",
        borderRadius: 2
    },
    card: {
        p: 1,
        m: 1,
        flex: 1
    }
};
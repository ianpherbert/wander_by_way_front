import Map from "./Map";
import {MapPointType, Point} from "../common/maps/Point";
import {RouteOutput, RouteStopOutput, RouteType} from "../../gql/graphql";
import React, {useCallback, useMemo, useState} from "react";
import {
    Box,
    Collapse,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Paper,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import {mapTripIconsMui} from "../../utils/mapTripIcons";
import {AddLocation, Close} from "@mui/icons-material";

const points = [{
    id: '1',
    longitude: -1.554136,
    latitude: 47.218637,
    type: MapPointType.SEARCH_ITEM,
    label: 'Nantes Station',
    routeInfo: {
        routes: [
            {
                durationHours: 0,
                durationMinutes: 20,
                durationTotal: 20,
                from: {
                    country: 'France',
                    id: '2',
                    latitude: '47.207779',
                    longitude: '-1.560047',
                    name: 'Commerce',
                },
                lineDistance: 5.5,
                to: {
                    country: 'France',
                    id: '1',
                    latitude: '47.218637',
                    longitude: '-1.554136',
                    name: 'Nantes Station',
                },
                type: RouteType.Bus,
            },
            {
                durationHours: 0,
                durationMinutes: 20,
                durationTotal: 20,
                from: {
                    country: 'France',
                    id: '2',
                    latitude: '47.207779',
                    longitude: '-1.560047',
                    name: 'Pinel',
                },
                lineDistance: 5.5,
                to: {
                    country: 'France',
                    id: '1',
                    latitude: '47.218637',
                    longitude: '-1.554136',
                    name: 'Nantes Station',
                },
                type: RouteType.Bus,
            }
        ],
        durationAverage: 20,
        lineDistanceAverage: 10,
    },
},
{
    id: '2',
    longitude: -1.560047,
    latitude: 47.207779,
    type: MapPointType.DESTINATION,
    label: 'Commerce',
    stopRouteInfo: {
        durationMinutes: 5,
        fromName: 'Nantes Station',
        type: RouteType.Train,
    },
}];

const style = {
    height: "70vh",
    width: "90vw",
    margin: "auto"
};

function PanelItem({route, onAdd}: { route: RouteOutput, onAdd: (to: RouteStopOutput) => void }) {
    const subtitle = useMemo(() => {
        const {durationHours, durationMinutes, from} = route;
        const hourString = durationHours ? durationHours : "0";
        const minuteString = durationMinutes ? durationMinutes : "";

        return `${hourString}:${minuteString} from ${from.name}`;
    }, [route]);

    const addStop = useCallback(() => route.to && onAdd(route.to), [onAdd, route]);

    return (
        <>
            <ListItem
                alignItems="flex-start"
                sx={styles.listItem}
                disablePadding
                disableGutters
                secondaryAction={
                    <AddLocation color="success"/>
                }
            >
                <Tooltip title={`Add ${route.to.name} to trip`} placement="left">
                    <ListItemButton onClick={addStop}>
                        <ListItemAvatar>
                            {mapTripIconsMui(route.type)}
                        </ListItemAvatar>
                        <ListItemText primary={route.to.name} secondary={subtitle}/>
                    </ListItemButton>
                </Tooltip>
            </ListItem>

        </>
    );
}

export default function TestMap() {
    const [selectedPoint, setSelectedPoint] = useState<Point>();

    const deselectPoint = useCallback(() => setSelectedPoint(undefined), [setSelectedPoint]);

    const selectedPointName = useMemo(() => {
        const names = selectedPoint?.routeInfo?.routes.map(it => it.to.name);
        const uniqueNames = Array.from(new Set(names));
        return uniqueNames.join("/");
    }, [selectedPoint]);

    const addStop = useCallback((stop: RouteStopOutput) => {
        console.log(stop);
        setSelectedPoint(undefined);
    }, [setSelectedPoint, selectedPoint]);

    return (
        <Stack sx={style} direction="row">
            <Map points={points} onSelectPoint={setSelectedPoint} selectedPoint={selectedPoint}/>
            <Box flex={1} display="flex">
                <Collapse orientation={"horizontal"} in={Boolean(selectedPoint?.routeInfo?.routes.length)}>
                    <Paper sx={styles.panelList} elevation={3}>
                        <Stack justifyContent="space-between" direction="row" alignItems="center" flex={1} mx={1}>
                            <Typography variant="h6">{selectedPointName}</Typography>
                            <Box m={1}>
                                <IconButton onClick={deselectPoint}>
                                    <Close/>
                                </IconButton>
                            </Box>
                        </Stack>
                        <List>
                            {selectedPoint?.routeInfo?.routes.map((it) => <PanelItem route={it} key={it.from.id}
                                onAdd={addStop}/>)}
                        </List>

                    </Paper>
                </Collapse>
            </Box>
        </Stack>
    );
}

const styles = {
    panelList: {
        width: 400,
        flex: 1,
        mx: 1,
        px: 1,
        height: "100%"
    },
    listItem: {
        alignItems: "center",
    }
};
import Map from "../map/Map";
import {Point} from "../common/maps/Point";
import {PointType, RouteOutput} from "../../gql/graphql";
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
import {useRoutePlannerContext} from "../../pages/RoutePlanner/RoutePlannerPage";
import useFindCityByTransit from "./useFindCityByTransit";
import {routeToStation, routeTypeToPointType} from "../../utils/routeStationTranslator";


function PanelItem({route, onAdd}: { route: RouteOutput, onAdd: (to: RouteOutput) => void }) {
    const subtitle = useMemo(() => {
        const {durationHours, durationMinutes, from} = route;
        const hourString = durationHours ? durationHours : "0";
        const minuteString = durationMinutes ? durationMinutes : "";

        return `${hourString}:${minuteString} from ${from.name}`;
    }, [route]);

    const addStop = useCallback(() => route && onAdd(route), [onAdd, route]);

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


export default function RoutePlannerMap() {
    const [selectedPoint, setSelectedPoint] = useState<Point>();
    const {points, addStop} = useRoutePlannerContext();

    const {cities} = useFindCityByTransit(selectedPoint?.id ?? "", routeToStation(selectedPoint?.routeInfo?.routes[0]?.type), String(selectedPoint?.routeInfo?.routes[0]?.to?.name), !selectedPoint);

    const deselectPoint = useCallback(() => setSelectedPoint(undefined), [setSelectedPoint]);

    const selectedPointName = useMemo(() => {
        const nameList = selectedPoint?.routeInfo?.routes.map(it => it.to.name);
        const names = Array.from(new Set(nameList)).join("/");
        if (cities?.[0]?.name && cities?.[0]?.name === String(names)) {
            return cities[0].name;
        }
        if (cities?.[0]?.name && cities?.[0]?.name !== String(names)) {
            return `${names} (${cities[0].name})`;
        }
        return names;

    }, [selectedPoint, cities]);

    const handleAddStop = useCallback((stop: RouteOutput) => {
        setSelectedPoint(undefined);
        const trip = {
            routeType: stop.type,
            durationHours: stop.durationHours as number,
            durationMinutes: stop.durationMinutes as number,
            durationTotal: stop.durationTotal as number
        };
        const city = cities?.[0];
        if (city) {
            addStop({
                id: city.id,
                latitude: city.latitude,
                longitude: city.longitude,
                name: city.name,
                pointType: PointType.City,
                trip
            });
        } else {
            addStop({...stop.to, pointType: routeTypeToPointType(stop.type), trip});
        }

    }, [setSelectedPoint, selectedPoint, cities]);


    return (
        <Stack sx={styles.wrapper} direction="row">
            <Map points={points} onSelectPoint={setSelectedPoint} selectedPoint={selectedPoint} showConnections={true}/>
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
                            {selectedPoint?.routeInfo?.routes.map((it) =>
                                <PanelItem route={it} key={it.from.id}
                                    onAdd={handleAddStop}
                                />
                            )}
                        </List>
                    </Paper>
                </Collapse>
            </Box>
        </Stack>
    );
}

const styles = {
    wrapper: {
        height: "70vh",
        width: "100%",
    },
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
import React, {Fragment, useEffect, useMemo, useState} from "react";
import {MapPointType, Point} from "../../../common/maps/Point";

import {useQuery} from "@apollo/client";
import {useParams} from "react-router-dom";
import {Stop} from "../../../../core/trip/Stop";
import Loader from "../../../common/loader";
import matchRoutes from "../utils/routeMatcher";
import mapRouteToStop from "../utils/mapRouteToStop";
import {
    FindAllRoutesDocument,
    FindAllRoutesQuery,
    FindAllRoutesQueryVariables,
    FindCityByIdDocument,
    FindCityByIdQuery,
    FindCityByIdQueryVariables,
    PointType,
    RouteOutput,
    RouteSearchFilterInput,
    RouteType
} from "../../../../gql/graphql";
import {routeTypeToPointType} from "../../../../utils/routeStationTranslator";
import MapDisplay from "../../../common/maps/MapDisplay";
import {useDispatch} from "react-redux";
import {setSearchPoints, useApiFilters} from "../../../../redux/map/mapSlice";
import {
    addStopToTrip,
    resetStops,
    setDestination,
    setOrigin,
    useTrip,
    useTripState
} from "../../../../redux/trip/tripSlice";
import {Toolbar} from "../../../common/maps/toolbar/Toolbar";
import {Box, Grid, Typography} from "@mui/material";
import {mapWrapperStyle, navigationStyle, routePreviewStyle} from "../routeFinderStyle";
import SkipFinder from "./skipFinder/SkipFinder";
import {mapTripIcons} from "../../../../utils/mapTripIcons";
import TripOverviewItem from "./TripOverviewItem";
import NotificationContainer from "../../../common/maps/notifications/NotificationContainer";
import {MapNotification} from "../../../common/maps/notifications/MapNotification";

interface SearchPoint {
    id: string,
    type: PointType,

    filters: RouteSearchFilterInput
}

export const RouteFinderMap = () => {
    const {fromId, toId} = useParams();
    const dispatch = useDispatch();
    const {stops, destination} = useTripState();
    const trip = useTrip();
    const apiFilters = useApiFilters();

    const [searchCity, setSearchCity] = useState<SearchPoint | undefined>({
        id: fromId || "",
        type: PointType.City,
        filters: apiFilters
    });
    const [customDropDown, setCustomDropDown] = useState<boolean>(false);

    const routesFromCity = useQuery<FindAllRoutesQuery, FindAllRoutesQueryVariables>(FindAllRoutesDocument, {
        variables: searchCity,
    });
    const routesFromDestinationCity = useQuery<FindAllRoutesQuery, FindAllRoutesQueryVariables>(FindAllRoutesDocument, {
        skip: !toId,
        variables: {id: toId || "", type: PointType.City, filters: apiFilters},
    });
    const originCity = useQuery<FindCityByIdQuery, FindCityByIdQueryVariables>(FindCityByIdDocument, {
        skip: !fromId,
        variables: {cityId: fromId || ""}
    });
    const destinationCity = useQuery<FindCityByIdQuery, FindCityByIdQueryVariables>(FindCityByIdDocument, {
        skip: !toId,
        variables: {cityId: toId === "anywhere" ? "" : toId || ""}
    });
    const destinationName = destination?.name;

    // Set points from stops and search points
    useEffect(() => {
        const searchRoutes = routesFromCity.data?.findAllRoutes?.map((item) =>
            (
                {
                    id: stop.name,
                    longitude: parseFloat(item?.longitude || "0"),
                    latitude: parseFloat(item?.latitude || "0"),
                    type: MapPointType.SEARCH_ITEM,
                    label: item?.destinationName || "",
                    routeInfo: {
                        routes: item?.routes || [],
                        durationAverage: item?.durationAverage || 0,
                        lineDistanceAverage: item?.lineDistanceAverage || 0
                    }
                }
            )
        ) || [];
        const origin = {
            id: stop.name,
            longitude: parseFloat(originCity.data?.findCityById?.longitude || "0"),
            latitude: parseFloat(originCity.data?.findCityById?.latitude || "0"),
            type: MapPointType.ORIGIN,
            label: originCity.data?.findCityById?.name || ""
        };
        const routeStops = stops.map(stop => (
            {
                id: stop.name,
                longitude: parseFloat(stop.longitude),
                latitude: parseFloat(stop.latitude),
                type: MapPointType.INTERMEDIATE,
                label: stop.name,
                stopRouteInfo: {
                    durationMinutes: stop?.duration,
                    fromName: stop?.from,
                    type: stop?.routeType
                }
            }
        ));
        const tempPoints = [origin, ...routeStops, ...searchRoutes];
        if (toId !== "anywhere") {
            const destinationPoint = {
                id: stop.name,
                longitude: parseFloat(destinationCity.data?.findCityById?.longitude || "0"),
                latitude: parseFloat(destinationCity.data?.findCityById?.latitude || "0"),
                type: MapPointType.DESTINATION,
                label: destinationCity.data?.findCityById?.name || ""
            };
            tempPoints.push(destinationPoint);
        }

        if (routesFromDestinationCity.data && routesFromCity.data && tempPoints.length > 0) {
            const matches = matchRoutes(routesFromDestinationCity.data, routesFromCity.data);
            const matchedPoints = tempPoints.map((point: Point) => {
                if (matches.includes(point.label)) {
                    return {...point, match: true};
                }
                return point;
            });
            dispatch(setSearchPoints(matchedPoints));
        } else {
            dispatch(setSearchPoints(tempPoints));
        }
    }, [routesFromCity.data, stops]);

    //Initialize page once the origin and destination cities are loaded
    useEffect(() => {
        if (!originCity.loading && !destinationCity.loading) {
            if (originCity?.data?.findCityById) {
                const {name, latitude, longitude} = originCity.data.findCityById;
                dispatch(setOrigin({
                    id: fromId,
                    name,
                    routeType: RouteType.Other,
                    origin: true,
                    destination: false,
                    duration: "0:00",
                    latitude,
                    longitude,
                    isCity: true
                }));
            }
            dispatch(setDestination({
                id: toId,
                name: destinationCity.data?.findCityById?.name || "",
                routeType: RouteType.Other,
                origin: false,
                destination: true,
                duration: "0:00",
                latitude: destinationCity.data?.findCityById?.latitude || "0",
                longitude: destinationCity.data?.findCityById?.longitude || "0",
                isCity: true
            }));
        }
    }, [originCity.loading, destinationCity.loading, destinationCity.loading]);

    const addStop = (route: RouteOutput, isCity: boolean, addId?: string, addPointType?: PointType, destination?: boolean) => {
        const newStop = mapRouteToStop(route, addId, destination, isCity);
        dispatch(addStopToTrip(newStop));
        if (destination) {
            // If the destinationName has been reached do not refetch
            dispatch(setDestination(newStop));
            setSearchCity(undefined);
        } else {
            // Search new points from new stop
            setSearchCity({id: addId || "", type: addPointType || PointType.Other, filters: apiFilters});
        }
    };

    const addCustomStop = (stop: Stop) => {
        const searchItem = {id: stop.id || "", type: routeTypeToPointType(stop.routeType), filters: apiFilters};
        setSearchCity(searchItem);
        routesFromCity.refetch(searchItem);
        dispatch(addStopToTrip(stop));
        setCustomDropDown(false);
    };

    const stepBack = (stop: Stop) => {
        const index = stops.findIndex((it) => it.id === stop.id);
        const stopsReset = index === -1 ? [] : [...stops].slice(0, index + 1);
        const searchItem = {
            id: stop?.id || "",
            type: stop.isCity ? PointType.City : routeTypeToPointType(stop.routeType),
            filters: apiFilters
        };
        dispatch(resetStops(stopsReset));
        setSearchCity(searchItem);
        routesFromCity.refetch(searchItem);
    };

    const transitionIcon = (routeType: RouteType) => (
        <>
            <i className={"icofont-double-right"}/>
            <i
                className={mapTripIcons(routeType)}
                onClick={() => {
                    setCustomDropDown(routeType === RouteType.Other && !customDropDown);
                }}
            />
            <i className={"icofont-double-right"}/>
        </>
    );

    const mapNotifications = useMemo(() => {
        const notifs = [];
        if (destinationName && routesFromDestinationCity.loading) {
            notifs.push({id: "2", text: `Getting data for ${destinationName}`, severity: "info"} as MapNotification);
        }
        return notifs;
    }, [destinationName, routesFromDestinationCity.loading, routesFromCity.loading, originCity.data?.findCityById?.name, searchCity]);

    return (
        <Grid container sx={{width: "90vw", margin: "auto"}}>
            <Typography onClick={() => console.log({trip, stops})}
                variant={"h5"}>{originCity.data?.findCityById?.name} to {destinationName || destinationCity.data?.findCityById?.name || "Anywhere"}</Typography>
            <Grid xs={12}>
                <Box sx={navigationStyle}>
                    <Box sx={routePreviewStyle}>
                        {trip.map(stop =>
                            <Fragment key={stop.id}>
                                {!stop.origin && <div>
                                    {transitionIcon(stop.routeType)}
                                </div>}
                                <TripOverviewItem stop={stop} restart={stepBack}/>
                            </Fragment>
                        )}
                    </Box>
                    <SkipFinder open={customDropDown} onAddStop={addCustomStop}
                        from={stops?.at(-1)?.from || originCity.data?.findCityById?.name || ""}/>
                </Box>
            </Grid>
            <Grid xs={12}>
                <Box sx={mapWrapperStyle}>
                    <Toolbar/>
                    {routesFromDestinationCity.loading && <div className={"map-notification"}>
                        <p>Searching from {destinationName || destinationCity.data?.findCityById?.name}</p>
                    </div>}
                    <MapDisplay onAddStop={addStop}/>
                    {routesFromCity.loading && <Loader/>}
                    <NotificationContainer notifications={mapNotifications}/>
                </Box>
            </Grid>
        </Grid>
    );
};

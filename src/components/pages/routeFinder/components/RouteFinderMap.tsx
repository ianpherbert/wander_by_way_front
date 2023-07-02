import React, {Fragment, useCallback, useEffect, useMemo, useState} from "react";
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

    const {
        data: routesFromCurrent,
        refetch: refetchCurrentRoutes,
        loading: loadingCurrentRoutes
    } = useQuery<FindAllRoutesQuery, FindAllRoutesQueryVariables>(FindAllRoutesDocument, {
        variables: searchCity,
    });

    const {
        data: routesFromDestination,
        loading: loadingFromDestination
    } = useQuery<FindAllRoutesQuery, FindAllRoutesQueryVariables>(FindAllRoutesDocument, {
        skip: !toId,
        variables: {id: toId || "", type: PointType.City, filters: apiFilters},
    });

    const {
        data: originInfo,
        loading: originInfoLoading
    } = useQuery<FindCityByIdQuery, FindCityByIdQueryVariables>(FindCityByIdDocument, {
        skip: !fromId,
        variables: {cityId: fromId || ""}
    });

    const {
        data: destinationInfo,
        loading: destinationInfoLoading
    } = useQuery<FindCityByIdQuery, FindCityByIdQueryVariables>(FindCityByIdDocument, {
        skip: !toId,
        variables: {cityId: toId === "anywhere" ? "" : toId || ""}
    });

    const destinationName = destination?.name;

    // Set points from stops and search points
    useEffect(() => {
        const searchRoutes: Point[] = routesFromCurrent?.findAllRoutes?.map((item) =>
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
            longitude: parseFloat(originInfo?.findCityById?.longitude || "0"),
            latitude: parseFloat(originInfo?.findCityById?.latitude || "0"),
            type: MapPointType.ORIGIN,
            label: originInfo?.findCityById?.name || ""
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
                longitude: parseFloat(destinationInfo?.findCityById?.longitude || "0"),
                latitude: parseFloat(destinationInfo?.findCityById?.latitude || "0"),
                type: MapPointType.DESTINATION,
                label: destinationInfo?.findCityById?.name || ""
            };
            tempPoints.push(destinationPoint);
        }

        if (routesFromDestination && routesFromCurrent && tempPoints.length > 0) {
            const matches = matchRoutes(routesFromDestination, routesFromCurrent);
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
    }, [routesFromCurrent, stops]);

    //Initialize page once the origin and destination cities are loaded
    useEffect(() => {
        if (!originInfoLoading && !destinationInfoLoading) {
            if (originInfo?.findCityById) {
                const {name, latitude, longitude} = originInfo.findCityById;
                dispatch(setOrigin({
                    id: fromId ?? "",
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
                id: toId ?? "",
                name: destinationInfo?.findCityById?.name || "",
                routeType: RouteType.Other,
                origin: false,
                destination: true,
                duration: "0:00",
                latitude: destinationInfo?.findCityById?.latitude || "0",
                longitude: destinationInfo?.findCityById?.longitude || "0",
                isCity: true
            }));
        }
    }, [originInfoLoading, destinationInfoLoading]);

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
        refetchCurrentRoutes(searchItem);
        dispatch(addStopToTrip(stop));
        setCustomDropDown(false);
    };

    const stepBack = (stop: Stop) => {
        const index = stops.findIndex((it) => it.id === stop.id);
        const stopsReset = index === -1 ? [] : [...stops].slice(0, index + 1);
        const searchItem = {
            id: stop?.id || "",
            // if isCity is true, that means that the ID corresponds to a city, and not the route type
            type: stop.isCity ? PointType.City : routeTypeToPointType(stop.routeType),
            filters: apiFilters
        };
        dispatch(resetStops(stopsReset));
        setSearchCity(searchItem);
        refetchCurrentRoutes(searchItem);
    };

    const transitionIcon = useCallback((routeType: RouteType) => (
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
    ), [customDropDown]);

    const mapNotifications = useMemo(() => {
        const notifs = [];
        if (destinationName && loadingFromDestination) {
            notifs.push({id: "2", text: `Getting data for ${destinationName}`, severity: "info"} as MapNotification);
        }
        return notifs;
    }, [destinationName, loadingFromDestination, loadingCurrentRoutes, originInfo?.findCityById?.name, searchCity]);

    return (
        <Grid container sx={{width: "90vw", margin: "auto"}}>
            <Typography
                variant={"h5"}>{originInfo?.findCityById?.name} to {destinationName || destinationInfo?.findCityById?.name || "Anywhere"}</Typography>
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
                        from={stops?.at(-1)?.from || originInfo?.findCityById?.name || ""}/>
                </Box>
            </Grid>
            <Grid xs={12}>
                <Box sx={mapWrapperStyle}>
                    <Toolbar/>
                    <MapDisplay onAddStop={addStop}/>
                    {loadingCurrentRoutes && <Loader/>}
                    <NotificationContainer notifications={mapNotifications}/>
                </Box>
            </Grid>
        </Grid>
    );
};

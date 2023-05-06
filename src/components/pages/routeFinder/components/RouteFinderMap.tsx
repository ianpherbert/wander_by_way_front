import React, {useEffect, useState} from "react";
import {MapPointType} from "../../../common/maps/Point";
import "../index.scss";

import {useQuery} from "@apollo/client";
import {useParams} from "react-router-dom";
import {Stop} from "../../../../core/trip/Stop";
import {mapTripIcons} from "../../../../utils/mapTripIcons";
import Loader from "../../../common/loader";
import matchRoutes from "./routeMatcher";
import TripOverviewItem from "./TripOverviewItem";
import SkipFinder from "./skipFinder/SkipFinder";
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
    RouteType
} from "../../../../gql/graphql";
import {routeTypeToPointType} from "../../../../utils/routeStationTranslator";
import MapDisplay from "../../../common/maps/MapDisplay";
import {useDispatch} from "react-redux";
import {setSearchPoints, useSearchPoints} from "../../../../redux/map/mapSlice";
import {setDestination, setOrigin, setStops, useTrip, useTripState} from "../../../../redux/trip/tripSlice";

interface SearchPoint {
    id: string,
    type: PointType
}

export const RouteFinderMap = () => {
    const {fromId, toId} = useParams();
    const dispatch = useDispatch();
    const searchPoints = useSearchPoints();
    const {stops, destination, origin} = useTripState();
    const trip = useTrip();

    const [searchCity, setSearchCity] = useState<SearchPoint | undefined>({id: fromId || "", type: PointType.City});
    const [update, setUpdate] = useState<boolean>(false);
    const [customDropDown, setCustomDropDown] = useState<boolean>(false);

    const routesFromCity = useQuery<FindAllRoutesQuery, FindAllRoutesQueryVariables>(FindAllRoutesDocument, {
        variables: searchCity,
    });
    const routesFromDestinationCity = useQuery<FindAllRoutesQuery, FindAllRoutesQueryVariables>(FindAllRoutesDocument, {
        variables: {id: toId || "", type: PointType.City},
    });
    const originCity = useQuery<FindCityByIdQuery, FindCityByIdQueryVariables>(FindCityByIdDocument, {
        variables: {cityId: fromId || ""}
    });
    const destinationCity = useQuery<FindCityByIdQuery, FindCityByIdQueryVariables>(FindCityByIdDocument, {
        variables: {cityId: toId === "anywhere" ? "" : toId || ""}
    });
    const destinationName = destination?.name;

    useEffect(() => {
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
                longitude
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
            longitude: destinationCity.data?.findCityById?.longitude || "0"
        }));
    }, [originCity.data, destinationCity.data]);

    useEffect(() => {
        if (routesFromDestinationCity.data && routesFromCity.data && searchPoints.length > 0 && update) {
            const matches = matchRoutes(routesFromDestinationCity.data, routesFromCity.data);
            if (matches.length > 0) {
                const matchedPoints = searchPoints.map(point => {
                    if (matches.includes(point.label)) {
                        point.match = true;
                    }
                    return point;
                });
                dispatch(setSearchPoints(matchedPoints));
                setUpdate(false);
            }
        }
    }, [searchPoints]);

    // Set points from stops and search points
    useEffect(() => {
        setUpdate(true);
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
            const destinationPoint = destinationName ? {
                id: stops?.at(-1)?.id || "",
                longitude: parseFloat(stops?.at(-1)?.longitude || "0"),
                latitude: parseFloat(stops?.at(-1)?.latitude || "0"),
                type: MapPointType.DESTINATION,
                label: destinationName
            } : {
                id: stop.name,
                longitude: parseFloat(destinationCity.data?.findCityById?.longitude || "0"),
                latitude: parseFloat(destinationCity.data?.findCityById?.latitude || "0"),
                type: MapPointType.DESTINATION,
                label: destinationCity.data?.findCityById?.name || ""
            };
            tempPoints.push(destinationPoint);
        }
        dispatch(setSearchPoints(tempPoints));
    }, [routesFromCity.data, stops]);

    //Initialize page once the origin and destination cities are loaded
    useEffect(() => {
        if (!originCity.loading && !destinationCity.loading) {
            //Once loading is done, load the initial data
            addStop(null);
        }
    }, [originCity.loading, destinationCity.loading]);

    const addStop = (route: RouteOutput | null, addId?: string, addPointType?: PointType, destination?: boolean) => {
        // Add new stop
        if (route !== null) {
            const newStop = mapRouteToStop(route, addId, destination);
            // Add new stop to "stops"
            dispatch(setStops([...stops, newStop]));

            if (destination) {
                // If the destinationName has been reached do not refetch
                dispatch(setDestination(newStop));
                setSearchCity(undefined);
            } else {
                // Search new points from new stop
                setSearchCity({id: addId || "", type: addPointType || PointType.Other});
            }
        }
    };

    const addCustomStop = (stop: Stop) => {
        setSearchCity({id: stop.id || "", type: routeTypeToPointType(stop.routeType)});
        dispatch(setStops([...stops, stop]));
        setCustomDropDown(false);
    };

    const resetStops = async (stop: Stop) => {
        const index = stops.indexOf(stop);
        dispatch(setDestination(undefined));
        const tempStops = stops;
        if (index === -1) {
            tempStops.splice(0);
        } else {
            tempStops.splice(index + 1);
        }
        dispatch(setStops(tempStops));
        addStop(null);
        setSearchCity({id: stop?.id || "", type: routeTypeToPointType(stop.routeType)});
    };


    return (
        <div id={"routeFinderMap"}>
            <h3>{originCity.data?.findCityById?.name} to {destinationName || destinationCity.data?.findCityById?.name || "Anywhere"}</h3>
            <div className={"map-navigation-wrapper"}>
                <div className={"navigation"}>
                    <div className={"route-preview"}>
                        {trip.map(stop =>
                            <React.Fragment key={stop.id}>
                                {!stop.origin && <div className={"route-transit"}>
                                    <i className={"icofont-double-right"}/>
                                    <i
                                        className={`${mapTripIcons(stop.routeType)} ${stop.routeType === RouteType.Other && "skip-stop"}`}
                                        onClick={() => {
                                            setCustomDropDown(stop.routeType === RouteType.Other && !customDropDown);
                                        }}
                                    />
                                    <i className={"icofont-double-right"}/>
                                </div>}
                                <TripOverviewItem stop={stop} restart={resetStops}/>
                            </React.Fragment>
                        )}

                    </div>
                    <SkipFinder open={customDropDown} onAddStop={addCustomStop}
                        from={stops?.at(-1)?.from || originCity.data?.findCityById?.name || ""}/>
                </div>

                <div className={"map-wrapper"}>
                    {routesFromDestinationCity.loading && <div className={"map-notification"}>
                        <p>Searching from {destinationName || destinationCity.data?.findCityById?.name}</p>
                    </div>}
                    <MapDisplay onAddStop={addStop}/>
                    {routesFromCity.loading && <Loader/>}
                </div>
            </div>
        </div>
    );
};

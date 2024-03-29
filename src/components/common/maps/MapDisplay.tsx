// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, {useEffect, useRef, useState} from "react";
import "./map.scss";
import {Button, IconButton, Tooltip} from "@mui/material";
import {mapTripIcons} from "../../../utils/mapTripIcons";
import {formatTime} from "../../../utils/timeFormatter";
import {useQuery} from "@apollo/client";
import {routeToStation, routeTypeToPointType} from "../../../utils/routeStationTranslator";

import mapboxgl, {LngLatBoundsLike} from "mapbox-gl";
import {
    CityOutput,
    FindAllCitiesFromAssociatedTransitDocument,
    FindAllCitiesFromAssociatedTransitQuery,
    FindAllCitiesFromAssociatedTransitQueryVariables,
    PointType,
    RouteOutput,
    RouteType
} from "../../../gql/graphql";
import {MapPointType} from "./Point";
import {
    setSelectedPoint,
    useAutoZoom,
    useFilteredPoints,
    useSelectedPoint,
    useShowConnections
} from "../../../redux/map/mapSlice";
import {useDispatch} from "react-redux";
import initMap from "./utils/InitMap";
import mapPoints from "./utils/mapPointInfo";
import {ClearSharp} from "@mui/icons-material";

interface MapProps {
    onAddStop?: (
        route: RouteOutput,
        isCity: boolean,
        addId: string,
        addPointType: PointType,
        destination: boolean,
    ) => void;
}

const MapDisplay = ({onAddStop}: MapProps) => {
    const selectedPoint = useSelectedPoint();
    const dispatch = useDispatch();
    const showConnections = useShowConnections();
    const filteredPoints = useFilteredPoints();
    const autoZoom = useAutoZoom();

    const [map, setMap] = useState<mapboxgl.Map>();
    const [popup, setPopup] = useState<mapboxgl.Popup>();

    const associatedCities = useQuery<FindAllCitiesFromAssociatedTransitQuery, FindAllCitiesFromAssociatedTransitQueryVariables>(FindAllCitiesFromAssociatedTransitDocument);
    const mainCity = (): CityOutput | undefined => {
        return associatedCities?.data?.findAllCitiesFromAssociatedTransit?.[0];
    };

    const shouldZoom = useRef(autoZoom);

    useEffect(() => {
        initMap().then(mapBox => {
            setMap(mapBox);
        });
    }, []);

    useEffect(() => {
        zoomToAllPoints();
    }, [filteredPoints]);

    useEffect(() => {
        shouldZoom.current = autoZoom;
    }, [autoZoom]);

    useEffect(() => {
        if (map) {
            const features = mapPoints(filteredPoints, showConnections);
            if (map.getSource("points") && features.length > 0) {
                map.getSource("points").setData({
                    type: "FeatureCollection",
                    features: features
                });
            } else if (!map.getSource("points")) {
                map.addSource("points", {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: features
                    }
                });
            }

            if (!map.getLayer("points")) {
                map.addLayer({
                    'id': "points",
                    'type': 'symbol',
                    'source': "points", // reference the data source
                    'layout': {
                        'icon-image': ['get', 'icon'],
                        "icon-size": ['get', 'scale'],
                        'icon-allow-overlap': false
                    }
                });
                map.on('click', "points", (e) => {
                    const coordinates = e.features?.[0].geometry?.coordinates.slice();
                    const description = e?.features?.[0]?.properties?.description;
                    if (shouldZoom.current) {
                        map.flyTo({
                            center: coordinates,
                            essential: true,
                            zoom: 10,
                            padding: {top: 0, bottom: 0, left: 0, right: 400}
                        });
                    }
                    dispatch(setSelectedPoint(JSON.parse(e?.features?.[0]?.properties.point)));
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }

                    setPopup(new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setHTML(description).on("close", closePopup)
                        .addTo(map));
                });

                // Change the cursor to a pointer when the mouse is over the places layer.
                map.on('mouseenter', 'points', () => {
                    map.getCanvas().style.cursor = 'pointer';
                });

                // Change it back to a pointer when it leaves.
                map.on('mouseleave', 'points', () => {
                    map.getCanvas().style.cursor = '';
                });
            }
        }
    }, [filteredPoints, map, showConnections]);

    function zoomToAllPoints() {
        if (filteredPoints.length < 1) {
            return;
        }
        const searchPoints = [...filteredPoints];
        const latSorted = searchPoints.sort((a, b) => a.latitude - b.latitude);
        const lonSorted = searchPoints.sort((a, b) => a.longitude - b.longitude);

        const extremePoints = {
            north: lonSorted[0],
            south: lonSorted[lonSorted.length - 1],
            west: latSorted[0],
            east: latSorted[latSorted.length - 1]
        };
        if (shouldZoom.current && map) {
            const southwest = [extremePoints.west?.longitude, extremePoints.south?.latitude];
            const northeast = [extremePoints.east?.longitude, extremePoints.north?.latitude];
            const bbox = [southwest, northeast] as LngLatBoundsLike;
            map.setPadding({top: 50, bottom: 50, left: 50, right: 50});
            map?.fitBounds(bbox, {
                padding: {top: 50, bottom: 50, left: 50, right: 50},
                duration: 2000,
                maxZoom: 7
            });
        }
    }

    function closePopup() {
        popup?.remove();
        setPopup(undefined);
    }

    const SidebarItem = (routeInfo: {
        routeInfo: RouteOutput;
    }) => {

        function handleClickAdd() {
            const {id} = mainCity() ?? {};
            closePopup();
            dispatch(setSelectedPoint(null));
            onAddStop?.(
                routeInfo.routeInfo,
                !!id,
                id || routeInfo.routeInfo.to.id || "",
                id ? PointType.City : routeTypeToPointType(routeInfo.routeInfo.type),
                false
            );
        }


        return (
            <div className={"sidebar-destination"}>

                <h3>{mainCity()?.name || routeInfo.routeInfo.to.name}</h3>
                <div>From: {routeInfo.routeInfo.from.name}</div>
                <div className={"sidebar-destination-icon"}>
                    <i className={mapTripIcons(routeInfo.routeInfo.type)}/>
                    {formatTime(routeInfo?.routeInfo?.durationTotal || 0)}
                </div>
                <div className={"add-to-trip-wrapper"}>
                    <div className={"add-to-trip-button-wrapper"}>
                        <Tooltip title={"Add to trip"}>
                            <Button
                                size={"medium"}
                                variant="outlined"
                                onClick={handleClickAdd}
                            >
                                <i className="icofont-ui-add"></i>
                            </Button>
                        </Tooltip>
                    </div>
                    <div className={"add-to-trip-button-wrapper"}>
                        <Tooltip title={"Add as destination"}>
                            <Button
                                size={"medium"}
                                variant="outlined"
                                onClick={() => {
                                    onAddStop?.(
                                        routeInfo.routeInfo,
                                        mainCity()?.id || routeInfo.routeInfo.to.id || "",
                                        mainCity()?.id ? PointType.City : routeTypeToPointType(routeInfo.routeInfo.type),
                                        true
                                    );
                                }}
                            >
                                <i className="icofont-flag-alt-2"></i>
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </div>
        );
    };

    const MapSideBar = () => {
        associatedCities.refetch({
            id: selectedPoint?.routeInfo?.routes[0]?.to?.id || "",
            transitType: routeToStation(
                selectedPoint?.routeInfo?.routes[0]?.type || RouteType.Other
            ),
            name: selectedPoint?.routeInfo?.routes[0]?.to?.name || "",
        });

        function shouldShow() {
            if (
                selectedPoint?.type === MapPointType.DESTINATION
                || selectedPoint?.type === MapPointType.ORIGIN
            ) {
                return "";
            }
            return selectedPoint?.type ? "open" : "closed";
        }

        function handleClose() {
            dispatch(setSelectedPoint(null));
            popup?.remove();
            setPopup(undefined);
        }

        return (
            <div
                className={`map-sidebar ${shouldShow()}`}
                hidden={!selectedPoint}
            >
                <IconButton aria-label="delete" size="small" onClick={handleClose}>
                    <ClearSharp fontSize="small"/>
                </IconButton>
                <div className={"map-sidebar-header"}>
                    <h2>
                        {associatedCities?.data?.findAllCitiesFromAssociatedTransit?.at(0)
                            ?.name ||
                            selectedPoint?.label ||
                            "null"}
                    </h2>
                </div>
                <div className={"map-sidebar-body"}>
                    {selectedPoint?.routeInfo?.routes.map(
                        (item: RouteOutput) => (
                            <SidebarItem
                                routeInfo={item}
                                key={item.from.id || "" + item.to.id}
                            />
                        )
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <MapSideBar/>
            <div id={"map"} className={"map"}/>
        </>
    );
};

export default MapDisplay;

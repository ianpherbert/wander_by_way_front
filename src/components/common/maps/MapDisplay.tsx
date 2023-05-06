import React, {useEffect, useState} from "react";
import "./map.scss";
import {RoundCloseButton} from "../buttons/roundCloseButton";
import {Button, Tooltip} from "@mui/material";
import {mapTripIcons} from "../../../utils/mapTripIcons";
import {formatTime} from "../../../utils/timeFormatter";
import {useQuery} from "@apollo/client";
import {routeToStation, routeTypeToPointType} from "../../../utils/routeStationTranslator";

import mapboxgl from "mapbox-gl";
import OriginPopup from "./popups/OriginPopup";
import StopPopup from "./popups/StopPopup";
import DestinationPopup from "./popups/DestinationPopup";
import SearchItemPopup from "./popups/SearchItemPopup";
import {
    FindAllCitiesFromAssociatedTransitDocument,
    FindAllCitiesFromAssociatedTransitQuery,
    FindAllCitiesFromAssociatedTransitQueryVariables,
    PointType,
    RouteOutput,
    RouteType
} from "../../../gql/graphql";
import {MapPointType, Point, PointInfo} from "./Point";
import {useFilters, useSearchPoints} from "../../../redux/map/mapSlice";

interface MapProps {
    onAddStop?: (
        route: RouteOutput,
        addId: string,
        addPointType: PointType,
        destination: boolean
    ) => void;
}


const MapDisplay = (props: MapProps) => {
    const points = useSearchPoints();
    const filters = useFilters();
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY || "";

    const [selectedPoint, setSelectedPoint] = useState<Point | null>(
        null
    );
    const [map, setMap] = useState<mapboxgl.Map>();
    const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);

    const associatedCities = useQuery<FindAllCitiesFromAssociatedTransitQuery, FindAllCitiesFromAssociatedTransitQueryVariables>(FindAllCitiesFromAssociatedTransitDocument);
    const mainCity = () => {
        const cities = associatedCities?.data?.findAllCitiesFromAssociatedTransit || [];
        return cities[0];
    };

    useEffect(() => {
        setMap(
            new mapboxgl.Map({
                style: process.env.REACT_APP_MAPBOX_STYLE || "",
                container: "map",
            })
        );
    }, []);

    useEffect(() => {
        if (map) {
            const {connections, route, flight, train, bus, ferry} = filters;
            const filteredPoints = [];
            const connectedPoints = points.filter(it => it.match);
            const origin = points.find((it) => it.type == MapPointType.ORIGIN);
            const destination = points.find((it) => it.type == MapPointType.DESTINATION);
            if (connections.applied) {
                filteredPoints.push(...connectedPoints);
            }
            const routes = points.filter(it => !it.match);
            if (route.applied) {
                filteredPoints.push(...routes);
            }
            const toSet = origin ? destination ? [origin, ...filteredPoints, destination] : [origin, ...filteredPoints] : filteredPoints;
            setUpMarkers(toSet);
        }
    }, [filters, points, map]);

    const mapPointInfo = (point: Point): PointInfo => {
        switch (point.type) {
        case MapPointType.SEARCH_ITEM:
            if (point.match) {
                return {
                    color: "#66ff00",
                    scale: .6,
                    body: SearchItemPopup(point, true),
                };
            }
            return {
                color: "#DA4167FF",
                scale: 0.5,
                body: SearchItemPopup(point, false),
            };

        case MapPointType.ORIGIN:
            return {color: "#da4167", scale: 1, body: OriginPopup(point)};
        case MapPointType.LAYOVER:
            return {color: "#D9E2E8", scale: 0.8, body: StopPopup(point)};
        case MapPointType.DESTINATION:
            return {
                color: "#f5cb5c",
                scale: 1,
                body: DestinationPopup(
                    point,
                    points.find((it) => it.type == MapPointType.ORIGIN)
                ),
            };
        case MapPointType.INTERMEDIATE:
            return {
                color: "#38e4ae",
                scale: 1,
                body: StopPopup(point),
            };
        default:
            return {
                color: "#38e4ae",
                scale: 1,
                body: StopPopup(point),
            };
        }
    };

    function setUpMarkers(pointsToSet: Point[]) {
        markers.forEach((it) => it.remove());
        if (map) {
            const tempMarkers: mapboxgl.Marker[] = [];
            pointsToSet.forEach((point) => {
                const pointInfo = mapPointInfo(point);
                const pointPopup = () => {
                    const popup = new mapboxgl.Popup().setHTML(pointInfo.body);
                    if (
                        point.type === MapPointType.SEARCH_ITEM
                    ) {
                        popup.on("open", () => {
                            setSelectedPoint(point);
                        });
                        popup.on("close", () => {
                            setSelectedPoint(null);
                        });
                    }
                    return popup;
                };
                const marker = new mapboxgl.Marker({
                    color: pointInfo.color,
                    draggable: false,
                    scale: pointInfo.scale,
                });
                marker.setLngLat({lon: point.longitude, lat: point.latitude});
                marker.addTo(map);
                marker.setPopup(pointPopup());
                tempMarkers.push(marker);
            });
            setMarkers(tempMarkers);
        }
    }

    const SidebarItem = (routeInfo: {
        routeInfo: RouteOutput;
    }) => {
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
                                onClick={() => {
                                    props.onAddStop?.(
                                        routeInfo.routeInfo,
                                        mainCity()?.id || routeInfo.routeInfo.to.id || "",
                                        mainCity()?.id ? PointType.City : routeTypeToPointType(routeInfo.routeInfo.type),
                                        false
                                    );
                                }}
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
                                    props.onAddStop?.(
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
        return (
            <div
                className={`map-sidebar ${selectedPoint ? "open" : "closed"}`}
                hidden={!selectedPoint}
            >
                <RoundCloseButton
                    onClose={() => {
                        setSelectedPoint(null);
                    }}
                    left={false}
                />
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

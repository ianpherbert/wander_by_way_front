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
import {useFilters, useSearchPoints, useShowConnections} from "../../../redux/map/mapSlice";

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
    // const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
    const showConnections = useShowConnections();

    const associatedCities = useQuery<FindAllCitiesFromAssociatedTransitQuery, FindAllCitiesFromAssociatedTransitQueryVariables>(FindAllCitiesFromAssociatedTransitDocument);
    const mainCity = () => {
        const cities = associatedCities?.data?.findAllCitiesFromAssociatedTransit || [];
        return cities[0];
    };

    useEffect(() => {
        const map = new mapboxgl.Map({
            style: process.env.REACT_APP_MAPBOX_STYLE || "",
            container: "map",
        });
        map.on("load", () => {
            setMap(map);
        });
    }, []);


    useEffect(() => {
        if (map) {
            const {connections, route, flight, train, bus, ferry} = filters;

            const acceptedTypes = [
                flight.applied ? RouteType.Plane.valueOf() : null,
                train.applied ? RouteType.Train.valueOf() : null,
                bus.applied ? RouteType.Bus.valueOf() : null,
                ferry.applied ? RouteType.Boat.valueOf() : null,
            ];


            const filteredPoints = points.filter((point) => {
                const filtered = point.routeInfo?.routes.filter(route =>
                    acceptedTypes.includes(route.type.valueOf())
                ) ?? [];
                return filtered.length > 0;
            }
            );


            const origin = points.find((it) => it.type == MapPointType.ORIGIN);
            const destination = filteredPoints.find((it) => it.type == MapPointType.DESTINATION);

            const secondFilter = [];

            //Apply Filters
            const connectedPoints = filteredPoints.filter(it => it.match);
            if (connections.applied) {
                secondFilter.push(...connectedPoints);
            }
            const routes = filteredPoints.filter(it => !it.match);
            if (route.applied) {
                secondFilter.push(...routes);
            }
            const toSet = origin ? destination ? [origin, ...secondFilter, destination] : [origin, ...secondFilter] : secondFilter;
            setUpMarkers(toSet);
        }
    }, [filters, points, map, showConnections]);

    const mapPointInfo = (point: Point): PointInfo => {
        switch (point.type) {
        case MapPointType.SEARCH_ITEM:
            if (point.match && showConnections) {
                return {
                    icon: "new-york-subway",
                    scale: .6,
                    body: SearchItemPopup(point, true),
                };
            }
            return {
                icon: "oslo-metro",
                scale: 0.5,
                body: SearchItemPopup(point, false),
            };

        case MapPointType.ORIGIN:
            return {icon: "stadium", scale: 1, body: OriginPopup(point)};
        case MapPointType.LAYOVER:
            return {icon: "windmill", scale: 0.8, body: StopPopup(point)};
        case MapPointType.DESTINATION:
            return {
                icon: "paris-metro",
                scale: 1,
                body: DestinationPopup(
                    point,
                    points.find((it) => it.type == MapPointType.ORIGIN)
                ),
            };
        case MapPointType.INTERMEDIATE:
            return {
                icon: "delhi-metro",
                scale: 1,
                body: StopPopup(point),
            };
        default:
            return {
                icon: "kiev-metro",
                scale: 1,
                body: StopPopup(point),
            };
        }
    };

    const [prevSource, setPrevSource] = useState<string>("");

    function setUpMarkers(pointsToSet: Point[]) {
        // markers.forEach((it) => it.remove());
        const rand = Math.random().toString();
        if (map) {
            try {
                map.removeLayer(prevSource);
            } catch (e) {
                console.log(prevSource, "error");
            }
            try {
                map.removeSource(prevSource);
            } catch (e) {
                console.log(prevSource, "error");
            }

            setPrevSource(rand);

            const features = pointsToSet.map(it => ({
                type: "Feature",
                properties: {
                    description: mapPointInfo(it).body,
                    icon: mapPointInfo(it).icon,
                    size: mapPointInfo(it).scale
                },
                geometry: {
                    type: "Point",
                    coordinates: [it.longitude, it.latitude]
                }
            }));


            map.addSource(rand, {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    features: features
                }
            });

            map.addLayer({
                'id': rand,
                'type': 'symbol',
                'source': rand, // reference the data source
                'layout': {
                    'icon-image': ['get', 'icon'],
                    "icon-size": ['get', 'scale'],
                    'icon-allow-overlap': false
                }
            });


            map.on('click', rand, (e) => {
                // Copy coordinates array.

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const coordinates = e.features?.[0].geometry?.coordinates.slice();
                const description = e?.features?.[0]?.properties?.description;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(description)
                    .addTo(map);
            });

            // Change the cursor to a pointer when the mouse is over the places layer.
            map.on('mouseenter', 'places', () => {
                map.getCanvas().style.cursor = 'pointer';
            });

            // Change it back to a pointer when it leaves.
            map.on('mouseleave', 'places', () => {
                map.getCanvas().style.cursor = '';
            });
            // const tempMarkers: mapboxgl.Marker[] = [];
            // pointsToSet.forEach((point) => {
            //     const pointInfo = mapPointInfo(point);
            //     const pointPopup = () => {
            //         const popup = new mapboxgl.Popup().setHTML(pointInfo.body);
            //         if (
            //             point.type === MapPointType.SEARCH_ITEM
            //         ) {
            //             popup.on("open", () => {
            //                 setSelectedPoint(point);
            //             });
            //             popup.on("close", () => {
            //                 setSelectedPoint(null);
            //             });
            //         }
            //         return popup;
            //     };
            //     const marker = new mapboxgl.Marker({
            //         color: pointInfo.color,
            //         draggable: false,
            //         scale: pointInfo.scale,
            //     });
            //     marker.setLngLat({lon: point.longitude, lat: point.latitude});
            //     marker.addTo(map);
            //     marker.setPopup(pointPopup());
            //     tempMarkers.push(marker);
            // });
            // setMarkers(tempMarkers);
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

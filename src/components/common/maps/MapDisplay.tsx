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
import {
    setSelectedPoint,
    useFilters,
    useSearchPoints,
    useSelectedPoint,
    useShowConnections
} from "../../../redux/map/mapSlice";
import {useDispatch} from "react-redux";

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
    const selectedPoint = useSelectedPoint();
    const dispatch = useDispatch();
    const [map, setMap] = useState<mapboxgl.Map>();
    const showConnections = useShowConnections();

    const associatedCities = useQuery<FindAllCitiesFromAssociatedTransitQuery, FindAllCitiesFromAssociatedTransitQueryVariables>(FindAllCitiesFromAssociatedTransitDocument);
    const mainCity = () => {
        const cities = associatedCities?.data?.findAllCitiesFromAssociatedTransit || [];
        return cities[0];
    };

    const icons = {
        home: {
            name: "home", path: "home.png"
        }, search: {
            name: "search",
            path: "search-point.png"
        }, destination: {
            name: "destination", path: "destination-point.png"
        }, intermediate: {
            name: "intermediate",
            path: "intermediate-point.png"
        }, connection: {
            name: "connection", path: "connection-point.png"
        }
    };

    useEffect(() => {
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY || "";
        const map = new mapboxgl.Map({
            style: process.env.REACT_APP_MAPBOX_STYLE || "",
            container: "map",
        });
        map.on("load", async () => {
            for (const icon of Object.entries(icons)) {
                map.loadImage(`/cartography/icons/${icon[1].path}`, (error, image) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    map.addImage(icon[1].name, image, {sdf: true, pixelRatio: 20});
                });
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
            setMap(map);
        });
        // });
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
            const destination = points.find((it) => it.type == MapPointType.DESTINATION);

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
                    icon: "connection",
                    scale: .6,
                    body: SearchItemPopup(point, true),
                };
            }
            return {
                icon: "connection",
                scale: 0.5,
                body: SearchItemPopup(point, false),
            };

        case MapPointType.ORIGIN:
            return {icon: "home", scale: 1, body: OriginPopup(point)};
        case MapPointType.LAYOVER:
            return {icon: "windmill", scale: 0.8, body: StopPopup(point)};
        case MapPointType.DESTINATION:
            return {
                icon: "destination",
                scale: 1,
                body: DestinationPopup(
                    point,
                    points.find((it) => it.type == MapPointType.ORIGIN)
                ),
            };
        case MapPointType.INTERMEDIATE:
            return {
                icon: "intermediate",
                scale: 1,
                body: StopPopup(point),
            };
        default:
            return {
                icon: "intermediate",
                scale: 1,
                body: StopPopup(point),
            };
        }
    };

    const [prevSource, setPrevSource] = useState<string>();

    function setUpMarkers(pointsToSet: Point[]) {

        if (map) {
            if (prevSource) {
                map.removeLayer(prevSource);
                map.removeSource(prevSource);
            }
            const rand = Math.random().toString();
            setPrevSource(rand);
            const features = pointsToSet.map(it => {
                const {body, icon, scale} = mapPointInfo(it);
                return {
                    type: it.type,
                    feature: {
                        type: "Feature",
                        properties: {
                            description: body,
                            icon: icon,
                            size: scale,
                            point: it
                        },
                        geometry: {
                            type: "Point",
                            coordinates: [it.longitude, it.latitude]
                        }
                    }
                };
            });


            map.addSource(rand, {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    features: features.map(it => it.feature)
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
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const coordinates = e.features?.[0].geometry?.coordinates.slice();
                const description = e?.features?.[0]?.properties?.description;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                dispatch(setSelectedPoint(JSON.parse(e?.features?.[0]?.properties.point)));
                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(description).on("close", () => {
                        dispatch(setSelectedPoint(null));
                    })
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
                                    dispatch(setSelectedPoint(null));
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

        function shouldShow() {
            if (
                selectedPoint?.type === MapPointType.DESTINATION
                || selectedPoint?.type === MapPointType.ORIGIN
            ) {
                return "";
            }
            return selectedPoint?.type ? "open" : "closed";
        }

        return (
            <div
                className={`map-sidebar ${shouldShow()}`}
                hidden={!selectedPoint}
            >
                <RoundCloseButton
                    onClose={() => {
                        dispatch(setSelectedPoint(null));
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

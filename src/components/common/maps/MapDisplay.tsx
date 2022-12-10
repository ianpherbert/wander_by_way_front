import React, {useEffect, useState} from "react";
import "./map.scss"
import {RoundCloseButton} from "../buttons/roundCloseButton";
import {Button} from "@mui/material";
import {calculateDistance} from "../../../utils/calculateDistance";
import {mapTripIcons} from "../../../utils/mapTripIcons";
import {GetRoutesFromCity_findAllRoutesFromCity_routes} from "../../../graphql/model/GetRoutesFromCity";
import {formatTime} from "../../../utils/timeFormatter";
import {useQuery} from "@apollo/client";
import {
    FindAllCitiesFromAssociatedTransit,
    FindAllCitiesFromAssociatedTransitVariables
} from "../../../graphql/model/FindAllCitiesFromAssociatedTransit";
import {FIND_ALL_CITIES_FROM_ASSOCIATED_TRANSIT} from "../../../graphql/queries";
import {RouteType} from "../../../graphql/model/globalTypes";
import {routeToStation} from "../../../utils/routeStationTranslator";

import mapboxgl from "mapbox-gl";

interface MapProps {
    points: Point[],
    onAddStop?: (route: GetRoutesFromCity_findAllRoutesFromCity_routes, addId: string) => void
}

export interface Point {
    longitude: number,
    latitude: number,
    type: PointType,
    label: string
    routeInfo?: {
        routes: GetRoutesFromCity_findAllRoutesFromCity_routes[],
        durationAverage : number,
        lineDistanceAverage: number
    } | null
    stopRouteInfo?:{
        durationMinutes: number,
        fromName: string,
        type: RouteType
    }
}

export enum PointType {
    ORIGIN,
    DESTINATION,
    INTERMEDIATE,
    LAYOVER,
    SEARCH_ITEM
}


const MapDisplay = (props: MapProps) => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY || "";

    const [selectedDestination, setSelectedDestination] = useState<Point | null>(null)
    const [map, setMap] = useState<mapboxgl.Map>()
    const [markers, setMarkers] = useState<mapboxgl.Marker[]>([])

    const associatedCities = useQuery<FindAllCitiesFromAssociatedTransit, FindAllCitiesFromAssociatedTransitVariables>(FIND_ALL_CITIES_FROM_ASSOCIATED_TRANSIT)
    const mainCity = () =>{
        const cities = associatedCities?.data?.findAllCitiesFromAssociatedTransit || [];
        return cities[0]
    }

    useEffect(() => {
        setMap(new mapboxgl.Map({
            style: process.env.REACT_APP_MAPBOX_STYLE || "",
            container: "map",
        }));
    }, []);

    useEffect(() => {
        markers.forEach(it => it.remove())
        if(map !== undefined){
            const tempMarkers : mapboxgl.Marker[] = [];
            props.points.forEach((point) => {
                let color : string;
                let scale : number;
                let body : string;
                switch (point.type) {
                    case PointType.SEARCH_ITEM:
                        color = "#ff0000";
                        scale = .5;
                        body = searchItemPopup(point)
                        break;
                    case PointType.ORIGIN:
                        color = "#da4167";
                        scale = 1;
                        body = originPopup(point)
                        break;
                    case PointType.LAYOVER:
                        color = "#D9E2E8";
                        scale = .8;
                        body = stopPopup(point)
                        break;
                    case PointType.DESTINATION:
                        color = "#f5cb5c";
                        scale = 1;
                        body = destinationPopup(point, props.points.find(it=> it.type == PointType.ORIGIN))
                        break;
                    case PointType.INTERMEDIATE:
                        color = "#38e4ae";
                        scale = 1;
                        body = stopPopup(point)
                        break;
                }

                const pointPopup = ()=>{
                    const popup = new mapboxgl
                        .Popup()
                        .setHTML(body);
                    if(point.type !== PointType.DESTINATION && point.type  !== PointType.ORIGIN){
                        popup.on("open", () => {
                            setSelectedDestination(point)
                        });
                        popup.on("close", () => {
                            setSelectedDestination(null)
                        });
                    }
                    return popup;
                }
                const marker = new mapboxgl.Marker({
                    color: color,
                    draggable: false,
                    scale: scale
                });
                marker.setLngLat({lon: point.longitude, lat: point.latitude});
                marker.addTo(map);
                marker.setPopup(pointPopup());
                tempMarkers.push(marker);
            })
            setMarkers(tempMarkers);
        }
    }, [props.points, map]);

    const searchItemPopup = (point: Point) => {
        return `<div class="point-popup">
                    <div class="point-popup-header">
                        <h4>${point.label}</h4>
                    </div>
                    <div  class="point-popup-body">
                        <div>${point?.routeInfo?.routes?.length} routes found</div>
                        <div>${point?.routeInfo?.durationAverage} minutes average</div>
                    </div>
                </div>`
    }

    const stopPopup = (point: Point) => {
        return `<div class="point-popup">
                    <div class="point-popup-header">
                        <h4>${point.label}</h4>
                    </div>
                    <div  class="point-popup-body">
                        <div>From: ${point?.stopRouteInfo?.fromName}</div>
                        <div>${point?.stopRouteInfo?.durationMinutes}</div>
                        <i class=${mapTripIcons(point?.stopRouteInfo?.type || RouteType.OTHER)}></i>
                    </div>
                </div>`
    }

    const originPopup=(point: Point)=>{
        return `<div class="point-popup">
                    <div class="point-popup-header">
                        <h4>${point.label}</h4>
                    </div>
                    <div  class="point-popup-body">
                        <div>Origin</div>
                    </div>
                </div>`
    }

    const destinationPopup=(point: Point, originPoint: Point | undefined)=>{
        let distance = "";
            if(originPoint){
                distance = `<div>${Math.floor(calculateDistance(point.latitude, point.longitude, originPoint.latitude, originPoint.longitude))}km from destination</div>`
            }
        return `<div class="point-popup">
                    <div class="point-popup-header">
                        <h4>${point.label}</h4>
                    </div>
                    <div  class="point-popup-body">
                        <div>Destination</div>
                        ${distance}
                    </div>
                </div>`
    }

    const SidebarItem = (routeInfo:{routeInfo: GetRoutesFromCity_findAllRoutesFromCity_routes}) => {
        return (<div className={"sidebar-destination"}>
            <div className={"sidebar-destination-icon"}>
                <i className={mapTripIcons(routeInfo.routeInfo.type)}/>
            </div>
            <h3>{mainCity()?.name || routeInfo.routeInfo.to.name}</h3>
            <div>From: {routeInfo.routeInfo.from.name}</div>
            <div className={"sidebar-destination-details"}>
                <div className={"time"}>{formatTime(routeInfo?.routeInfo?.durationTotal || 0)}</div>
                    <Button onClick={()=>{props.onAddStop?.(routeInfo.routeInfo, mainCity()?.id || routeInfo.routeInfo.to.id || "")}}>Add to trip</Button>
            </div>
        </div>)
    }

    const MapSideBar = () => {
        associatedCities.refetch({
            id: selectedDestination?.routeInfo?.routes[0]?.to?.id || "",
            transitType: routeToStation(selectedDestination?.routeInfo?.routes[0]?.type || RouteType.OTHER),
            name: selectedDestination?.routeInfo?.routes[0]?.to?.name || ""
        })
        return (
            <div className={`map-sidebar ${selectedDestination ? "open" : "closed"}`} hidden={!selectedDestination}>
                <RoundCloseButton onClose={() => {
                    setSelectedDestination(null)
                }} left={false}/>
                <div className={"map-sidebar-header"}>
                    <h2>{associatedCities?.data?.findAllCitiesFromAssociatedTransit?.at(0)?.name || selectedDestination?.label || "null"}</h2>
                </div>
                <div className={"map-sidebar-body"}>
                    {selectedDestination?.routeInfo?.routes.map((item: GetRoutesFromCity_findAllRoutesFromCity_routes) => (
                        <SidebarItem routeInfo={item} key={item.from.id || "" + item.to.id}/>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <>
            <MapSideBar/>
            <div id={"map"} className={"map"}/>
        </>

    )
}


export default MapDisplay

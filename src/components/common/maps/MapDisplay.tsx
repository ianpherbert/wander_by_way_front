import React, {useEffect, useState} from "react";
import "./map.scss"
import {RoundCloseButton} from "../buttons/roundCloseButton";
import {Button} from "@mui/material";
import {calculateDistance} from "../../../utils/calculateDistance";
import {mapTripIcons} from "../../../utils/mapTripIcons";
import {GetRoutesFromCity_findAllRoutesFromCity_routes} from "../../../graphql/model/GetRoutesFromCity";
import {formatTime} from "../../../utils/timeFormatter";

interface MapProps {
    points: Point[],
    onAddStop: (route: GetRoutesFromCity_findAllRoutesFromCity_routes) => void
}

export interface Point {
    longitude: string,
    latitude: string,
    type: PointType,
    label: string
    routeInfo?: {
        routes: GetRoutesFromCity_findAllRoutesFromCity_routes[],
        durationAverage : number,
        lineDistanceAverage: number
    } | null
}

export enum PointType {
    ORIGIN,
    DESTINATION,
    INTERMEDIATE,
    LAYOVER,
    SEARCH_ITEM
}


const MapDisplay = (props: MapProps) => {
    const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
    mapboxgl.accessToken = 'pk.eyJ1Ijoid2FuZGVyYnl3YXkiLCJhIjoiY2w3MXpoaGxqMHJkbzQxc2JxMDF6cGV1ZSJ9.hfHBDo0Zv31hoaWuRGMvhA';

    const [selectedDestination, setSelectedDestination] = useState<Point | null>(null)
    const [map, setMap] = useState()
    const [markers, setMarkers] = useState<any[]>([])

    useEffect(() => {
        setMap(new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/wanderbyway/cl71zld5d000h14qp4orozrsy',
        }));
    }, []);

    useEffect(() => {
        markers.forEach(it => it.remove())
        const tempMarkers : any[] = [];

        props.points.forEach((point) => {
            let color : string;
            let scale : number;
            let body : string;
            switch (point.type) {
                case PointType.SEARCH_ITEM:
                    color = "#ff0000";
                    scale = .5;
                    body = stopPopup(point)
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
    }, [props.points, map]);

    const stopPopup = (point: Point) => {
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
                distance = `<div>${Math.floor(calculateDistance(parseInt(point.latitude), parseInt(point.longitude), parseInt(originPoint.latitude), parseInt(originPoint.longitude)))}km from destination</div>`
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
                <i className={mapTripIcons(routeInfo.routeInfo.type)}></i>
            </div>
            <h3>{routeInfo.routeInfo.to.name}</h3>
            <div>From: {routeInfo.routeInfo.from.name}</div>
            <div className={"sidebar-destination-details"}>
                <div className={"time"}>{formatTime(routeInfo?.routeInfo?.durationTotal || 0)}</div>
                <Button onClick={()=>{props?.onAddStop(routeInfo.routeInfo)}}>Add to trip</Button>
            </div>
        </div>)
    }

    const MapSideBar = () => {
        return (
            <div className={`map-sidebar ${selectedDestination ? "open" : "closed"}`} hidden={!selectedDestination}>
                <RoundCloseButton onClose={() => {
                    setSelectedDestination(null)
                }} left={false}/>
                <div className={"map-sidebar-header"}>
                    <h2>{selectedDestination?.label}</h2>
                </div>
                <div className={"map-sidebar-body"}>
                    {selectedDestination?.routeInfo?.routes.map((item: GetRoutesFromCity_findAllRoutesFromCity_routes) => (
                        <SidebarItem routeInfo={item}/>
                    ))}
                    {/*<SidebarItem/>*/}
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

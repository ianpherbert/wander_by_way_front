import React, {useEffect, useState} from "react";
import "./map.scss"
import {RoundCloseButton} from "../buttons/roundCloseButton";
import {Button} from "@mui/material";
import {RouteType} from "../../../trip/RouteType";

interface MapProps {
    points: Point[],
    connected?: boolean
}

export interface Point {
    longitude: string,
    latitude: string,
    type: PointType,
    label: string
    routeType: RouteType
}

export enum PointType {
    ORIGIN,
    DESTINATION,
    INTERMEDIATE,
    LAYOVER
}


const Map = (props: MapProps) => {
    const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
    mapboxgl.accessToken = 'pk.eyJ1Ijoid2FuZGVyYnl3YXkiLCJhIjoiY2w3MXpoaGxqMHJkbzQxc2JxMDF6cGV1ZSJ9.hfHBDo0Zv31hoaWuRGMvhA';

    const [sideBar, setSideBar] = useState<Point | null>(null)

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/wanderbyway/cl71zld5d000h14qp4orozrsy',
        });
        props.points.forEach((point) => {

            let color;
            let scale;
            switch (point.type) {
                case PointType.ORIGIN:
                    color = "#da4167";
                    scale = 1.5;
                    break;
                case PointType.LAYOVER:
                    color = "#D9E2E8";
                    scale = .8;
                    break;
                case PointType.DESTINATION:
                    color = "#f5cb5c";
                    scale = 1.5;
                    break;
                case PointType.INTERMEDIATE:
                    color = "#38e4ae";
                    scale = 1;
                    break;
            }

            const pointPopup = new mapboxgl
                .Popup()
                .setHTML(popup(point))
            pointPopup.on("open", () => {
                setSideBar(point)
            })
            pointPopup.on("close", () => {
                setSideBar(null)
            })
            new mapboxgl.Marker({
                color: color,
                draggable: false,
                scale: scale
            })
                .setLngLat({lon: point.longitude, lat: point.latitude})
                .addTo(map)
                .setPopup(pointPopup)
        })

    }, []);

    const popup = (point: Point) => {
        return `<div class="point-popup">
                    <div class="point-popup-header">
                        <h4>${point.label}</h4>
                    </div>
                    <div  class="point-popup-body">
                        <div>2 routes found</div>
                        <div>1:40 average</div>
                    </div>
                </div>`
    }

    const SidebarItem = () => {
        function mapTripIcons(type: RouteType): string {
            let iconClass;
            switch (type) {
                case RouteType.BUS:
                    iconClass = "icofont-bus"
                    break;
                case RouteType.TRAIN:
                    iconClass = "icofont-train-line"
                    break;
                case RouteType.PLANE:
                    iconClass = "icofont-airplane"
                    break;
                case RouteType.BOAT:
                    iconClass = "icofont-sail-boat"
                    break;
                case RouteType.CAR:
                    iconClass = "icofont-car-alt-4"
                    break
                default:
                    iconClass = "icofont-runner-alt-1"
            }
            return iconClass
        }

        return (<div className={"sidebar-destination"}>
            <div className={"sidebar-destination-icon"}>
                <i className={mapTripIcons(sideBar?.routeType!!)}></i>
            </div>
            <h3>Gare de Nantes</h3>
            <div>From: Gare de strasbourg</div>
            <div className={"sidebar-destination-details"}>
                <div className={"time"}>1:56</div>
                <Button>Add to trip</Button>
            </div>
        </div>)
    }

    const MapSideBar = () => {
        return (
            <div className={`map-sidebar ${sideBar ? "open" : "closed"}`}>
                <RoundCloseButton onClose={() => {
                    setSideBar(null)
                }} left={false}/>
                <div className={"map-sidebar-header"}>
                    <h2>{sideBar?.label}</h2>
                </div>
                <div className={"map-sidebar-body"}>
                    <SidebarItem/>
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


export default Map

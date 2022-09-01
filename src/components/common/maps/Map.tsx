import React, {useEffect, useRef, useState} from "react";
import "./map.scss"

interface MapProps{
    points : Point[],
    connected?: boolean
}

export interface Point{
    longitude: string,
    latitude: string,
    type: PointType,
    label: string
}

export enum PointType{
    ORIGIN,
    DESTINATION,
    INTERMEDIATE,
    LAYOVER
}

const Map=(props: MapProps)=>{
    const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
    mapboxgl.accessToken = 'pk.eyJ1Ijoid2FuZGVyYnl3YXkiLCJhIjoiY2w3MXpoaGxqMHJkbzQxc2JxMDF6cGV1ZSJ9.hfHBDo0Zv31hoaWuRGMvhA';
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/wanderbyway/cl71zld5d000h14qp4orozrsy',
        });
        props.points.forEach((point)=>{

                let color;
                    switch (point.type){
                        case PointType.ORIGIN:
                            color = "red";
                            break;
                        case PointType.LAYOVER:
                            color = "grey";
                            break;
                        case PointType.DESTINATION:
                            color = "green";
                            break;
                        case PointType.INTERMEDIATE:
                            color = "blue";
                            break;
                    }


                new mapboxgl.Marker({
                    color: color,
                    draggable: false
                })
                    .setLngLat({lon: point.longitude, lat: point.latitude})
                    .addTo(map)
                    .setPopup(new mapboxgl.Popup().setHTML("<H4>"+point.label+"</H4>"))
        })

    });

    return(
        <div id={"map"} className={"map"}/>
    )
}

export default Map

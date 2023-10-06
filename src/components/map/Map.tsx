import {Box, BoxProps} from "@mui/material";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import mapboxgl, {GeoJSONSource, LngLatBoundsLike, LngLatLike} from "mapbox-gl";
import {mapIcons} from "./icons";
import {Point} from "../common/maps/Point";
import mapPoints from "./mapPointInfo";
import {Feature} from "geojson";

type MapProps = BoxProps & {
    points?: Point[];
    showConnections?: boolean;
    autoZoom?: boolean;
    selectedPoint?: Point;
    onSelectPoint?: (point?: Point) => void;
}

async function initMap(): Promise<mapboxgl.Map> {
    return new Promise((resolve, reject) => {
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY || "";
        const map = new mapboxgl.Map({
            style: process.env.REACT_APP_MAPBOX_STYLE || "",
            container: "map",
        });
        map.on("load", async () => {
            for (const icon of Object.entries(mapIcons)) {
                map.loadImage(`/cartography/icons/${icon[1].path}`, (error, image) => {
                    map.addImage(icon[1].name, image as HTMLImageElement, {pixelRatio: 30});
                });
            }
            resolve(map);
        });
        map.on("error", () => {
            reject("Could not load map");
        });
    });
}

function addPointsLayer(map: mapboxgl.Map, onSelectPoint: (id: string) => void, onClosePopup: () => void) {
    map.addSource("points", {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: []
        }
    });

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
    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'points', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'points', () => {
        map.getCanvas().style.cursor = '';
    });


    map.on('click', "points", ({features}) => {
        const feature = features?.[0] as Feature;

        if (!feature) return;

        const geometry = feature.geometry as unknown as {
            coordinates: number[],
            type: string;
        };
        const coordinates = geometry.coordinates as LngLatLike;
        const {id} = feature.properties ?? {};
        map.flyTo({
            center: coordinates,
            essential: true,
            zoom: 12,
            padding: {top: 0, bottom: 0, left: 0, right: 0}
        });


        onSelectPoint(id);

    });
}


function Map({autoZoom, points, onSelectPoint, selectedPoint, showConnections, ...props}: MapProps) {
    const [map, setMap] = useState<mapboxgl.Map>();
    const [popup, setPopup] = useState<mapboxgl.Popup>();
    // Initialise map
    useEffect(() => {
        if (!map) {
            initMap().then(mapBox => {
                setMap(mapBox);
                addPointsLayer(mapBox, selectPoint, clearSelectedPoint);
            });
        }
    }, []);

    const clearSelectedPoint = useCallback(() => {
        onSelectPoint?.(undefined);
        popup?.remove();
        setPopup(undefined);
    }, [onSelectPoint]);

    const features = useMemo(() => points ? mapPoints(points, Boolean(showConnections)) : [], [points, showConnections]);

    const selectedFeature = useMemo(() => features.find(it => it.properties.id === selectedPoint?.id), [features, selectedPoint]);

    const selectPoint = useCallback((id: string) => {
        const selectedPoint = points?.find(it => it.id === id);
        if (onSelectPoint && selectedPoint) onSelectPoint(selectedPoint);
    }, [onSelectPoint]);

    useEffect(() => {
        if (selectedFeature && map) {
            const popup = new mapboxgl.Popup()
                .setLngLat(selectedFeature.geometry.coordinates)
                .setHTML(selectedFeature.properties.description).on("close", clearSelectedPoint)
                .addTo(map);
            setPopup(popup);
        }
        if (!selectedFeature && map) {
            popup?.remove();
        }
    }, [selectedFeature, map]);

    useEffect(() => {
        if (map && features) {
            const source = map.getSource("points") as GeoJSONSource;
            source.setData({
                type: "FeatureCollection",
                features: features
            });
        }
    }, [features, map]);

    //if Map and points exist and autozoom is true zoom to points
    useEffect(() => {
        if (!points || selectedPoint) {
            return;
        }
        const searchPoints = [...points];
        const latSorted = searchPoints.sort((a, b) => a.latitude - b.latitude);
        const lonSorted = searchPoints.sort((a, b) => a.longitude - b.longitude);

        const extremePoints = {
            north: lonSorted[0],
            south: lonSorted[lonSorted.length - 1],
            west: latSorted[0],
            east: latSorted[latSorted.length - 1]
        };
        if (autoZoom !== false && map) {
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
    }, [map, points, autoZoom, selectedPoint]);

    return (
        <Box sx={styles.container} {...props} >
            <Box id={"map"} sx={styles.map}/>
        </Box>);
}

const styles = {
    container: {
        width: "100%",
        height: "100%",
        position: "relative"
    },
    map: {
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        left: 0,
    }
};

export default Map;
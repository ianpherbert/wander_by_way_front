import mapboxgl from "mapbox-gl";
import {mapIcons} from "../icons";


function initMap(): Promise<mapboxgl.Map> {
    return new Promise((resolve, reject) => {
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY || "";
        const map = new mapboxgl.Map({
            style: process.env.REACT_APP_MAPBOX_STYLE || "",
            container: "map",
        });
        map.on("load", async () => {
            for (const icon of Object.entries(mapIcons)) {
                map.loadImage(`/cartography/icons/${icon[1].path}`, (error, image) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    map.addImage(icon[1].name, image, {pixelRatio: 30});
                });
            }
            resolve(map);
        });
    });
}

export default initMap;

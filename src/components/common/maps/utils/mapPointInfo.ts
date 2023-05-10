import {MapPointType, Point, PointInfo} from "../Point";
import SearchItemPopup from "../popups/SearchItemPopup";
import OriginPopup from "../popups/OriginPopup";
import StopPopup from "../popups/StopPopup";
import DestinationPopup from "../popups/DestinationPopup";
import {mapIcons} from "../icons";
import {RouteType} from "../../../../gql/graphql";

export interface MapFeature {
    type: "Feature";
    properties: {
        description: string;
        icon: string;
        size: number;
        point: Point;
    }
    geometry: {
        type: "Point",
        coordinates: [number, number]
    }
}

function mapPoints(points: Point[], showConnections: boolean): MapFeature[] {
    const mapPointInfo = (point: Point): PointInfo => {
        let searchIconType = "";
        switch (point.type) {
        case MapPointType.SEARCH_ITEM:
            if (point.match && showConnections) {
                return {
                    icon: mapIcons.connection.name,
                    scale: .6,
                    body: SearchItemPopup(point, true),
                };
            }

            switch (point.routeInfo?.routes[0].type) {
            case RouteType.Boat:
                searchIconType = mapIcons.search.name;
                break;
            case RouteType.Bus:
                searchIconType = mapIcons.bus.name;
                break;
            case RouteType.Plane:
                searchIconType = mapIcons.flight.name;
                break;
            case RouteType.Train:
                searchIconType = mapIcons.train.name;
                break;
            default:
                searchIconType = mapIcons.search.name;
            }
            return {
                icon: searchIconType,
                scale: 0.5,
                body: SearchItemPopup(point, false),
            };

        case MapPointType.ORIGIN:
            return {icon: mapIcons.home.name, scale: 1, body: OriginPopup(point)};
        case MapPointType.LAYOVER:
            return {icon: mapIcons.connection.name, scale: 0.8, body: StopPopup(point)};
        case MapPointType.DESTINATION:
            return {
                icon: mapIcons.destination.name,
                scale: 1,
                body: DestinationPopup(
                    point,
                    points.find((it) => it.type == MapPointType.ORIGIN)
                ),
            };
        case MapPointType.INTERMEDIATE:
        default:
            return {
                icon: mapIcons.intermediate.name,
                scale: 1,
                body: StopPopup(point),
            };
        }
    };

    return points.map(it => {
        const {body, icon, scale} = mapPointInfo(it);
        return {
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
        };
    });
}

export default mapPoints;
import {RouteType, StationType} from "../graphql/model/globalTypes";

export const stationToRoute = (stationType: StationType) =>{
    switch (stationType){
        case StationType.AIRPORT:
            return RouteType.PLANE;
        case StationType.TRAIN:
            return RouteType.TRAIN;
        case StationType.BUS:
            return RouteType.BUS;
        case StationType.FERRY:
            return RouteType.BOAT;
        default:
            return RouteType.OTHER
    }
}

export const routeToStation = (routeType: RouteType) =>{
    switch (routeType){
        case RouteType.PLANE:
            return StationType.AIRPORT
        case RouteType.TRAIN:
            return StationType.TRAIN;
        case RouteType.BUS:
            return StationType.BUS;
        case RouteType.BOAT:
            return StationType.FERRY;
        default:
            return StationType.OTHER;
    }
}

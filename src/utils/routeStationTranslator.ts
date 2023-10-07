import {PointType, RouteType, StationType} from "../gql/graphql";


export const stationToRoute = (stationType: StationType) => {
    switch (stationType) {
    case StationType.Airport:
        return RouteType.Plane;
    case StationType.Train:
        return RouteType.Train;
    case StationType.Bus:
        return RouteType.Bus;
    case StationType.Ferry:
        return RouteType.Boat;
    default:
        return RouteType.Other;
    }
};

export const routeToStation = (routeType?: RouteType) => {
    switch (routeType) {
    case RouteType.Plane:
        return StationType.Airport;
    case RouteType.Train:
        return StationType.Train;
    case RouteType.Bus:
        return StationType.Bus;
    case RouteType.Boat:
        return StationType.Ferry;
    default:
        return StationType.Other;
    }
};

export const routeTypeToPointType = (routeType?: RouteType): PointType => {
    switch (routeType) {
    case RouteType.Plane:
        return PointType.Airport;
    case RouteType.Train:
    case RouteType.Bus:
        return PointType.Station;
    case RouteType.Boat:
        return PointType.Port;
    default:
        return PointType.City;
    }
};

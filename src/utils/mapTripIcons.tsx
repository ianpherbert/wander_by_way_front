import {PointType, RouteType} from "../gql/graphql";
import {
    DirectionsBoat,
    DirectionsBus,
    DirectionsCar,
    DirectionsTransit,
    Flight,
    Hiking,
    LocationCity,
} from "@mui/icons-material";
import React from "react";
import {SvgIconProps} from "@mui/material";

export function mapTripIcons(type: RouteType): string {
    let iconClass;
    switch (type) {
    case RouteType.Bus:
        iconClass = "icofont-bus";
        break;
    case RouteType.Train:
        iconClass = "icofont-train-line";
        break;
    case RouteType.Plane:
        iconClass = "icofont-airplane";
        break;
    case RouteType.Boat:
        iconClass = "icofont-sail-boat";
        break;
    case RouteType.Car:
        iconClass = "icofont-car-alt-4";
        break;
    default:
        iconClass = "icofont-travelling";
    }
    return iconClass;
}

export function mapTripIconsMui(type: RouteType | PointType, props?: SvgIconProps): JSX.Element {

    switch (type) {
    case RouteType.Bus:
        return <DirectionsBus {...props}/>;
    case RouteType.Train:
    case PointType.Station:
        return <DirectionsTransit {...props}/>;
    case PointType.Airport:
    case RouteType.Plane:
        return <Flight {...props}/>;
    case PointType.Port:
    case RouteType.Boat:
        return <DirectionsBoat {...props}/>;
    case RouteType.Car:
        return <DirectionsCar {...props}/>;
    case PointType.City:
        return <LocationCity {...props}/>;
    default:
        return <Hiking {...props}/>;
    }
}

export function TransitIcon({type, ...props}: { type: RouteType | PointType } & SvgIconProps) {
    switch (type) {
    case RouteType.Bus:
        return <DirectionsBus {...props}/>;
    case RouteType.Train:
    case PointType.Station:
        return <DirectionsTransit {...props}/>;
    case PointType.Airport:
    case RouteType.Plane:
        return <Flight {...props}/>;
    case PointType.Port:
    case RouteType.Boat:
        return <DirectionsBoat {...props}/>;
    case RouteType.Car:
        return <DirectionsCar {...props}/>;
    case PointType.City:
        return <LocationCity {...props}/>;
    default:
        return <Hiking {...props}/>;
    }
}

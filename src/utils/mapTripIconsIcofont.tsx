import {RouteType} from "../gql/graphql";
import React, {ReactElement} from "react";
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import {
    AirplanemodeActive,
    DirectionsBike,
    DirectionsBoat,
    DirectionsCar,
    DirectionsRailway
} from "@mui/icons-material";


export function mapTripIconsIcofont(type: RouteType): string {
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

export function mapTripIcons(type: RouteType): ReactElement {
    let iconClass;
    switch (type) {
    case RouteType.Bus:
        iconClass = <DirectionsBusIcon/>;
        break;
    case RouteType.Train:
        iconClass = <DirectionsRailway/>;
        break;
    case RouteType.Plane:
        iconClass = <AirplanemodeActive/>;
        break;
    case RouteType.Boat:
        iconClass = <DirectionsBoat/>;
        break;
    case RouteType.Car:
        iconClass = <DirectionsCar/>;
        break;
    default:
        iconClass = <DirectionsBike/>;
    }
    return iconClass;
}
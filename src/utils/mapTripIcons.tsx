import {RouteType} from "../gql/graphql";
import {DirectionsBoat, DirectionsBus, DirectionsCar, DirectionsTransit, Flight, Hiking} from "@mui/icons-material";
import React from "react";

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

export function mapTripIconsMui(type: RouteType): JSX.Element {

    switch (type) {
    case RouteType.Bus:
        return <DirectionsBus/>;
    case RouteType.Train:
        return <DirectionsTransit/>;
    case RouteType.Plane:
        return <Flight/>;
    case RouteType.Boat:
        return <DirectionsBoat/>;
    case RouteType.Car:
        return <DirectionsCar/>;
    default:
        return <Hiking/>;
    }
}

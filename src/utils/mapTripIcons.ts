import {RouteType} from "../gql/graphql";


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

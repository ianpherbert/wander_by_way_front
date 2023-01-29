import {RouteType} from "../graphql/model/globalTypes";


export function mapTripIcons(type: RouteType): string {
    let iconClass;
    switch (type) {
    case RouteType.BUS:
        iconClass = "icofont-bus";
        break;
    case RouteType.TRAIN:
        iconClass = "icofont-train-line";
        break;
    case RouteType.PLANE:
        iconClass = "icofont-airplane";
        break;
    case RouteType.BOAT:
        iconClass = "icofont-sail-boat";
        break;
    case RouteType.CAR:
        iconClass = "icofont-car-alt-4";
        break;
    default:
        iconClass = "icofont-travelling";
    }
    return iconClass;
}

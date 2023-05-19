import {RouteOutput, RouteType} from "../../../gql/graphql";

export interface PointInfo {
    icon: string;
    scale: number;
    body: string;
}

export interface Point {
    id: string;
    longitude: number;
    latitude: number;
    type: MapPointType;
    label: string;
    routeInfo?: {
        routes: RouteOutput[];
        durationAverage: number;
        lineDistanceAverage: number;
    } | null;
    stopRouteInfo?: {
        durationMinutes: number;
        fromName: string;
        type: RouteType;
    };
    match?: boolean
}

export enum MapPointType {
    ORIGIN,
    DESTINATION,
    INTERMEDIATE,
    LAYOVER,
    SEARCH_ITEM,
}

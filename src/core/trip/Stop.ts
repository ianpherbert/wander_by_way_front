import {RouteType} from "../../graphql/model/globalTypes";

export interface Stop{
    name: string,
    routeType: RouteType,
    origin: boolean,
    destination: boolean,
    duration: string,
    latitude: string,
    longitude: string
    from?: string
}

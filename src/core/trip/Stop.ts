import {RouteType} from "../../gql/graphql";


export interface Stop {
    id: string | undefined | null,
    name: string,
    routeType: RouteType,
    origin: boolean,
    destination: boolean,
    duration: string,
    latitude: string,
    longitude: string
    from?: string,

    isCity: boolean
}

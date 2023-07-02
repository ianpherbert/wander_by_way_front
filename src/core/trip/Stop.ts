import {RouteType} from "../../gql/graphql";

/**
 * This interface defines the shape of an object representing a stop in a route.
 *
 * @interface
 * @property {string} id - The unique identifier of the stop.
 * @property {string} name - The name of the stop.
 * @property {RouteType} routeType - The type of transport used to get to the stop from the previous stop.
 * @property {boolean} origin - Indicates if this stop is the origin of the route.
 * @property {boolean} destination - Indicates if this stop is the destination of the route.
 * @property {string} duration - The duration of the trip from the previous stop.
 * @property {string} latitude - The geographical latitude of the stop.
 * @property {string} longitude - The geographical longitude of the stop.
 * @property {string} [from] - Indicates the previous stop in the route. This property is optional.
 * @property {boolean} isCity - Indicates if the stop is a city, if true the ID property is that of the city, and not that of the transit object.
 */
export interface Stop {
    id: string,
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

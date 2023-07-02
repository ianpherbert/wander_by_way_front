import {Stop} from "../../../../core/trip/Stop";

import {formatTime} from "../../../../utils/timeFormatter";
import {RouteOutput, RouteType} from "../../../../gql/graphql";

/**
 * This function maps a Route object to a Stop Object
 *
 * @param {RouteOutput} route - The Route Object from The API
 * @param {string | undefined} addId - The Id that will be added, if undefined the to Id of the Route will be used
 * @param {boolean | undefined} destination - Whether or not the stop will be the destination of the trip
 * @param {boolean} isCity - If the addId represents a city
 * @returns {Stop} - The mapped Stop
 */
const mapRouteToStop = (route: RouteOutput, addId: string | undefined, destination: boolean | undefined, isCity: boolean): Stop => {
    return {
        id: addId ?? route?.to?.id ?? "",
        name: route?.to?.name || "",
        routeType: route?.type || RouteType.Other,
        origin: false,
        destination: destination || false,
        duration: formatTime(route?.durationTotal || 0),
        latitude: route.to?.latitude || "0",
        longitude: route.to?.longitude || "0",
        from: route.from?.name || "",
        isCity
    };
};

export default mapRouteToStop;
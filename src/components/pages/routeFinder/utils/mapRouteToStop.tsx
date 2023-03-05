
import {Stop} from "../../../../core/trip/Stop";

import {formatTime} from "../../../../utils/timeFormatter";
import {RouteOutput, RouteType} from "../../../../gql/graphql";

const mapRouteToStop = (route: RouteOutput, addId: string | undefined, destination: boolean | undefined): Stop =>{
    return {
        id: addId || route?.to?.id,
        name: route?.to?.name || "",
        routeType: route?.type || RouteType.Other,
        origin: false,
        destination: destination || false,
        duration: formatTime(route?.durationTotal || 0),
        latitude: route.to?.latitude || "0",
        longitude: route.to?.longitude || "0",
        from: route.from?.name || ""
    };
};

export default mapRouteToStop;
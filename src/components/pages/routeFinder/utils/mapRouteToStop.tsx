import {GetRoutesFromCity_findAllRoutesFromCity_routes} from "../../../../graphql/model/GetRoutesFromCity";
import {Stop} from "../../../../core/trip/Stop";
import {RouteType} from "../../../../graphql/model/globalTypes";
import {formatTime} from "../../../../utils/timeFormatter";

const mapRouteToStop = (route: GetRoutesFromCity_findAllRoutesFromCity_routes, addId: string | undefined, destination: boolean | undefined): Stop =>{
    return {
        id: addId || route?.to?.id,
        name: route?.to?.name || "",
        routeType: route?.type || RouteType.OTHER,
        origin: false,
        destination: destination || false,
        duration: formatTime(route?.durationTotal || 0),
        latitude: route.to?.latitude || "0",
        longitude: route.to?.longitude || "0",
        from: route.from?.name || ""
    };
};

export default mapRouteToStop;
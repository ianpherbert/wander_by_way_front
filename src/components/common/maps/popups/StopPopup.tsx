import {mapTripIcons} from "../../../../utils/mapTripIcons";
import {RouteType} from "../../../../graphql/model/globalTypes";
import {Point} from "../MapDisplay";

const StopPopup = (point: Point) => {
    return `<div class="point-popup">
                    <div class="point-popup-header">
                        <h4>${point.label}</h4>
                    </div>
                    <div  class="point-popup-body">
                        <div>From: ${point?.stopRouteInfo?.fromName}</div>
                        <div>${point?.stopRouteInfo?.durationMinutes}</div>
                        <i class=${mapTripIcons(point?.stopRouteInfo?.type || RouteType.OTHER)}></i>
                    </div>
                </div>`
}

export default StopPopup

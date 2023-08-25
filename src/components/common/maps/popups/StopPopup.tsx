import {mapTripIconsIcofont} from "../../../../utils/mapTripIconsIcofont";

import {Point} from "../Point";
import {RouteType} from "../../../../gql/graphql";

const StopPopup = (point: Point) => {
    return `<div class="point-popup">
                    <div class="point-popup-header">
                        <h4>${point.label}</h4>
                    </div>
                    <div  class="point-popup-body">
                        <div>From: ${point?.stopRouteInfo?.fromName}</div>
                        <div>${point?.stopRouteInfo?.durationMinutes}</div>
                        <i class=${mapTripIconsIcofont(point?.stopRouteInfo?.type || RouteType.Other)}></i>
                    </div>
                </div>`;
};

export default StopPopup;

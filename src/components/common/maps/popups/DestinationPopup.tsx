import {calculateDistance} from "../../../../utils/calculateDistance";
import {Point} from "../MapDisplay";

const DestinationPopup=(point: Point, originPoint: Point | undefined)=>{
    let distance = "";
    if(originPoint){
        distance = `<div>${Math.floor(calculateDistance(point.latitude, point.longitude, originPoint.latitude, originPoint.longitude))}km from destination</div>`;
    }
    return `<div class="point-popup">
                    <div class="point-popup-header">
                        <h4>${point.label}</h4>
                    </div>
                    <div  class="point-popup-body">
                        <div>Destination</div>
                        ${distance}
                    </div>
                </div>`;
};

export default DestinationPopup;

import {Point} from "../Point";

const OriginPopup = (point: Point) => {
    return `<div class="point-popup">
                    <div class="point-popup-header">
                        <h4>${point.label}</h4>
                    </div>
                    <div  class="point-popup-body">
                        <div>Origin</div>
                    </div>
                </div>`;
};

export default OriginPopup;

import {Point} from "../Point";

const SearchItemPopup = (point: Point, connection: boolean) => {

    return `<div class="point-popup">
                    <div class="point-popup-header">
                        <h4>${point.label}</h4>
                        ${connection && "<i class=\"icofont-exclamation-circle\"></i>"}
                    </div>
                    <div  class="point-popup-body">
                        <div>${point?.routeInfo?.routes?.length} routes found</div>
                        <div>${point?.routeInfo?.durationAverage} minutes average</div>
                    </div>
                </div>`;
};

export default SearchItemPopup;

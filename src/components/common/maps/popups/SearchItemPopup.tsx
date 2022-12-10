import {Point} from "../MapDisplay";

const SearchItemPopup = (point: Point) => {
    return `<div class="point-popup">
                    <div class="point-popup-header">
                        <h4>${point.label}</h4>
                    </div>
                    <div  class="point-popup-body">
                        <div>${point?.routeInfo?.routes?.length} routes found</div>
                        <div>${point?.routeInfo?.durationAverage} minutes average</div>
                    </div>
                </div>`
}

export default SearchItemPopup

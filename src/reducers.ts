import {combineReducers} from 'redux';
import {appSlice, AppState} from "./redux/app/appSlice";
import {mapSlice, MapState} from "./redux/map/mapSlice";
import {tripSlice, TripState} from "./redux/trip/tripSlice";


const rootReducer = combineReducers({
    appSlice: appSlice.reducer,
    mapSlice: mapSlice.reducer,
    tripSlice: tripSlice.reducer
});

declare module "react-redux" {
    interface RootState {
        appSlice: AppState,
        mapSlice: MapState
        tripSlice: TripState
    }
}

export default rootReducer;
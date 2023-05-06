import { combineReducers } from 'redux';
import {appSlice, AppState} from "./redux/app/appSlice";
import {mapSlice, MapState} from "./redux/map/mapSlice";


const rootReducer = combineReducers({
    appSlice: appSlice.reducer,
    mapSlice: mapSlice.reducer
});

declare module "react-redux"{
    interface RootState {
        appSlice: AppState,
        mapSlice: MapState
    }
}

export default rootReducer;
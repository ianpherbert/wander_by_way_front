import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState, useSelector} from "react-redux";
import {Point} from "../../components/common/maps/Point";

export interface MapState {
    searchPoints: Point[];
}

const initialState: MapState = {
    searchPoints: [],
};

export const mapSlice = createSlice({
    name: "appSlice",
    initialState,
    reducers: {
        setSearchPoints: (state: MapState, action: PayloadAction<Point[]>) => {
            state.searchPoints = action.payload;
        },
    },
});

export const {setSearchPoints} = mapSlice.actions;

export const useAppState = () => {
    return useSelector((state: RootState) => {
        return state.mapSlice;
    });
};

export const useSearchPoints = () => {
    return useSelector((state: RootState) => {
        return state.mapSlice.searchPoints;
    });
};

import { createSlice } from "@reduxjs/toolkit";
import { RootState, useSelector } from "react-redux";

export interface MapState {
    connected: boolean;
}

const initialState: MapState = {
    connected: false
};

export const mapSlice = createSlice({
    name: "appSlice",
    initialState,
    reducers: {
        toggleConnected: (state: MapState) => {
            state.connected = !state.connected;
        },
    }
});

export const {toggleConnected} = mapSlice.actions;

export const useAppState = () => {
    return useSelector((state: RootState)=>{
        return state.mapSlice;
    });
};
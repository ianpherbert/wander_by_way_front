import { createSlice } from "@reduxjs/toolkit";
import { RootState, useSelector } from "react-redux";

export interface AppState {
    connected: boolean;
}

const initialState: AppState = {
    connected: false
};

export const appSlice = createSlice({
    name: "appSlice",
    initialState,
    reducers: {
        toggleConnected: (state: AppState) => {
            state.connected = !state.connected;
        },
    }
});

export const {toggleConnected} = appSlice.actions;

export const useAppState = () => {
    return useSelector((state: RootState)=>{
        return state.appSlice;
    });
};
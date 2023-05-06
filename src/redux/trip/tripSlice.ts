import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState, useSelector} from "react-redux";
import {Stop} from "../../core/trip/Stop";

export interface TripState {
    stops: Stop[],
    origin?: Stop,
    destination?: Stop,
    trip: Stop[]
}

const initialState: TripState = {
    stops: [],
    trip: []
};

export const tripSlice = createSlice({
    name: "tripSlice",
    initialState,
    reducers: {
        addStopToTrip: (state: TripState, action: PayloadAction<Stop[]>) => {
            state.stops = action.payload;
        },
        setOrigin: (state: TripState, action: PayloadAction<Stop>) => {
            state.origin = action.payload;
        },
        setDestination: (state: TripState, action: PayloadAction<Stop>) => {
            state.destination = action.payload;
        },
        setStops: (state: TripState, action: PayloadAction<Stop[]>) => {
            state.stops = action.payload;
        },
        setTrip: (state: TripState, action: PayloadAction<Stop[]>) => {
            state.trip = action.payload;
        },
    },
});

export const {addStopToTrip, setOrigin, setDestination, setStops, setTrip} = tripSlice.actions;

export const useTripState = () => {
    return useSelector((state: RootState) => {
        return state.tripSlice;
    });
};

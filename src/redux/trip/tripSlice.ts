import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState, useSelector} from "react-redux";
import {Stop} from "../../core/trip/Stop";

export interface TripState {
    stops: Stop[],
    origin?: Stop,
    originName?: string,
    destinationName?: string,
    destination?: Stop,
}

const initialState: TripState = {
    stops: [],
};

export const tripSlice = createSlice({
    name: "tripSlice",
    initialState,
    reducers: {
        addStopToTrip: (state: TripState, action: PayloadAction<Stop>) => {
            state.stops = [...state.stops, action.payload];
        },
        setOrigin: (state: TripState, action: PayloadAction<Stop>) => {
            if (state.origin !== action.payload) {
                state.originName = action.payload.name;
                state.origin = action.payload;
            }
        },
        setDestination: (state: TripState, action: PayloadAction<Stop | undefined>) => {
            if (state.destination !== action.payload) {
                state.destinationName = action.payload?.name;
                state.destination = action.payload;
            }
        },
        setStops: (state: TripState, action: PayloadAction<Stop[]>) => {
            state.stops = action.payload;
        },
    },
});

export const {addStopToTrip, setOrigin, setDestination, setStops} = tripSlice.actions;

export const useTripState = () => {
    return useSelector((state: RootState) => {
        return state.tripSlice;
    });
};

export const useTrip = () => {
    return useSelector((state: RootState) => {
        const {origin, stops, destination} = state.tripSlice;
        console.log(origin, stops, destination);
        return [origin ?? [], ...stops, destination ?? []].flat();
    });
};

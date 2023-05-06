import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState, useSelector} from "react-redux";
import {Point} from "../../components/common/maps/Point";

export type FilterName = "connections" | "flight" | "train" | "bus" | "ferry"

interface Filter {
    active: boolean,
    applied: boolean
}

interface Filters {
    connections: Filter;
    flight: Filter;
    train: Filter;
    bus: Filter;
    ferry: Filter;
}

export interface MapState {
    searchPoints: Point[];
    filters: Filters
}

const initialState: MapState = {
    searchPoints: [],
    filters: {
        connections: {
            active: false,
            applied: false,
        },
        flight: {
            active: true,
            applied: true,
        },
        train: {
            active: true,
            applied: true,
        },
        bus: {
            active: true,
            applied: true,
        },
        ferry: {
            active: true,
            applied: true,
        },
    }
};

export const mapSlice = createSlice({
    name: "mapSlice",
    initialState,
    reducers: {
        setSearchPoints: (state: MapState, action: PayloadAction<Point[]>) => {
            const connections = action.payload.map(it => it.match).length > 0;
            if (connections) {
                state.filters.connections = {...state.filters.connections, active: true};
            }


            state.searchPoints = action.payload;
        },
        toggleFilter: (state: MapState, action: PayloadAction<"connections" | "flight" | "train" | "bus" | "ferry">) => {
            const filter = action.payload;
            if (state.filters[filter].active) {
                state.filters[filter] = {active: true, applied: !state.filters[filter].applied};
            }
        }
    },
});

export const {setSearchPoints, toggleFilter} = mapSlice.actions;

export const useFilters = () => {
    return useSelector((state: RootState) => {
        return state.mapSlice.filters;
    });
};

export const useSearchPoints = () => {
    return useSelector((state: RootState) => {
        return state.mapSlice.searchPoints;
    });
};

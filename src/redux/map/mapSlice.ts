import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState, useSelector} from "react-redux";
import {MapPointType, Point} from "../../components/common/maps/Point";
import {RouteSearchFilterInput} from "../../gql/graphql";

export type FilterName = "connections" | "flight" | "train" | "bus" | "ferry" | "route"

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
    route: Filter;
}

export interface MapState {
    searchPoints: Point[];
    filters: Filters;
    showConnections: boolean;
}

const initialState: MapState = {
    searchPoints: [],
    showConnections: true,
    filters: {
        connections: {
            active: false,
            applied: true,
        },
        route: {
            active: true,
            applied: true,
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
            if (connections && state.searchPoints.find(it => it.type == MapPointType.DESTINATION)) {
                state.filters.connections = {...state.filters.connections, active: true};
            }
            state.searchPoints = action.payload;
        },
        toggleFilter: (state: MapState, action: PayloadAction<FilterName>) => {
            const filter = action.payload;
            if (state.filters[filter].active) {
                state.filters[filter] = {active: true, applied: !state.filters[filter].applied};
            }
        },
        toggleShowConnections: (state: MapState) => {
            state.showConnections = !state.showConnections;
        }
    },
});

export const {setSearchPoints, toggleFilter, toggleShowConnections} = mapSlice.actions;

export const useFilters = () => {
    return useSelector((state: RootState) => {
        return state.mapSlice.filters;
    });
};

export const useShowConnections = () => {
    return useSelector((state: RootState) => {
        return state.mapSlice.showConnections;
    });
};

export const useApiFilters = () => {
    return useSelector((state: RootState): RouteSearchFilterInput => {
        const {bus, train, flight, ferry} = state.mapSlice.filters;
        return {
            bus: bus.applied,
            ferry: ferry.applied,
            flight: flight.applied,
            train: train.applied,
        };
    });
};

export const useSearchPoints = () => {
    return useSelector((state: RootState) => {
        return state.mapSlice.searchPoints;
    });
};

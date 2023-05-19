import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState, useSelector} from "react-redux";
import {MapPointType, Point} from "../../components/common/maps/Point";
import {RouteSearchFilterInput, RouteType} from "../../gql/graphql";

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
    filteredPoints: Point[];
    filters: Filters;
    showConnections: boolean;
    selectedPoint: Point | null;
    autoZoom: boolean;
}

const initialState: MapState = {
    autoZoom: true,
    selectedPoint: null,
    searchPoints: [],
    filteredPoints: [],
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

function applyFilters(points: Point[], filters: Filters) {
    const {connections, route, flight, train, bus, ferry} = filters;

    const acceptedTypes = [
        flight.applied ? RouteType.Plane.valueOf() : null,
        train.applied ? RouteType.Train.valueOf() : null,
        bus.applied ? RouteType.Bus.valueOf() : null,
        ferry.applied ? RouteType.Boat.valueOf() : null,
    ];


    const filteredPoints = points.filter((point) => {
        if (point.id != "stop") {
            return true;
        }
        const filtered = point.routeInfo?.routes.filter(route =>
            acceptedTypes.includes(route.type.valueOf())
        ) ?? [];
        return filtered.length > 0;
    }
    );


    const origin = points.find((it) => it.type == MapPointType.ORIGIN);
    const destination = points.find((it) => it.type == MapPointType.DESTINATION);
    const secondFilter = [];

    //Apply Filters
    const connectedPoints = filteredPoints.filter(it => it.match);
    if (connections.applied) {
        secondFilter.push(...connectedPoints);
    }
    const routes = filteredPoints.filter(it => !it.match);
    if (route.applied) {
        secondFilter.push(...routes);
    }
    return origin ? destination ? [origin, ...secondFilter, destination] : [origin, ...secondFilter] : secondFilter;
}

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
            state.filteredPoints = applyFilters(action.payload, state.filters);
        },
        toggleFilter: (state: MapState, action: PayloadAction<FilterName>) => {
            const filter = action.payload;
            if (state.filters[filter].active) {
                state.filters[filter] = {active: true, applied: !state.filters[filter].applied};
                state.filteredPoints = applyFilters(state.searchPoints, state.filters);
            }
        },
        toggleShowConnections: (state: MapState) => {
            state.showConnections = !state.showConnections;
        },
        setSelectedPoint: (state: MapState, action: PayloadAction<Point | null>) => {
            state.selectedPoint = action.payload;
        },
        toggleAutoZoom: (state: MapState) => {
            state.autoZoom = !state.autoZoom;
        }
    },
});

export const {
    setSearchPoints,
    toggleFilter,
    toggleShowConnections,
    setSelectedPoint,
    toggleAutoZoom
} = mapSlice.actions;

export const useAutoZoom = () => {
    return useSelector((state: RootState) => {
        return state.mapSlice.autoZoom;
    });
};


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

export const useSelectedPoint = () => {
    return useSelector((state: RootState) => {
        return state.mapSlice.selectedPoint;
    });
};

export const useFilteredPoints = () => {
    return useSelector((state: RootState) => {
        return state.mapSlice.filteredPoints;
    });
};

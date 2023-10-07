import {Box} from "@mui/material";
import RoutePlannerMap from "../../components/RoutePlanner/RoutePlannerMap";
import {createContext, useCallback, useContext, useMemo, useState} from "react";
import {PointType, RouteStopOutput} from "../../gql/graphql";
import {useParams} from "react-router-dom";
import {Point} from "../../components/common/maps/Point";
import useRouteSearchPoints, {SearchPoint} from "../../components/RoutePlanner/useRouteSearchPoints";

export type Filter = {
    active: boolean,
    applied: boolean
}

export type Filters = {
    // connections: Filter;
    flight: boolean;
    train: boolean;
    bus: boolean;
    ferry: boolean;
    // route: Filter;
}

const defaultFilter = true;
//     {
//     active: false,
//     applied: false
// };

const defaultFilters = {
    // connections: defaultFilter,
    flight: defaultFilter,
    train: defaultFilter,
    bus: defaultFilter,
    ferry: defaultFilter,
    // route: defaultFilter
};

type RoutePlannerContextState = {
    points: Point[];
    filters: Filters;
    setFilters: (filters: Filters) => void;
    addStop: (stop: RouteStopOutput) => void;
}

const RoutePlannerContext = createContext<RoutePlannerContextState>({} as RoutePlannerContextState);

export function useRoutePlannerContext() {
    const context = useContext(RoutePlannerContext);
    return context;
}

function matchPoints(searchPoints: Point[], destinationPoints?: Point[]): Point[] {
    const destinationIds = Array.from(new Set(searchPoints.map(it => it.id)));
    return searchPoints.map((it) => ({
        ...it, match: destinationIds.includes(it.id)
    }));
}

export default function RoutePlannerPage() {
    const {fromId, toId} = useParams();
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [searchPoint, setSearchPoint] = useState<RouteStopOutput>();

    const routesFromDestinationObject: SearchPoint = useMemo(() => ({
        skip: !toId,
        variables: {id: toId || "", type: PointType.City, filters},
    }), [toId, filters]);
    const {points: destinationRoutes, loading: destinationLoading} = useRouteSearchPoints(routesFromDestinationObject);

    const routesFromSelectedObject: SearchPoint = useMemo(() => ({
        variables: {id: searchPoint?.id ?? fromId ?? "", type: PointType.City, filters},
    }), [fromId, searchPoint, filters]);
    const {points: searchPoints, loading: searchLoading} = useRouteSearchPoints(routesFromSelectedObject);


    const addStop = useCallback((stop: RouteStopOutput) => {
        console.log(stop);
    }, []);

    const points = useMemo(() => matchPoints(searchPoints ?? [], destinationRoutes), [searchPoints, destinationRoutes]);


    return (
        <RoutePlannerContext.Provider
            value={{
                filters,
                points,
                setFilters,
                addStop
            }}>
            <Box m="auto">
                <RoutePlannerMap/>
            </Box>
        </RoutePlannerContext.Provider>);
}
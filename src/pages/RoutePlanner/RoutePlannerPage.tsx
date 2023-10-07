import {Box} from "@mui/material";
import RoutePlannerMap from "../../components/RoutePlanner/RoutePlannerMap";
import {createContext, useCallback, useContext, useMemo, useState} from "react";
import {PointType, RouteStopOutput} from "../../gql/graphql";
import {useParams} from "react-router-dom";
import {MapPointType, Point} from "../../components/common/maps/Point";
import useRouteSearchPoints from "../../components/RoutePlanner/useRouteSearchPoints";
import useCity from "../../components/RoutePlanner/useCity";
import MapLoader from "../../components/map/MapLoader";

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

type TripPoint = RouteStopOutput & {
    type: PointType
}

type RoutePlannerContextState = {
    points: Point[];
    filters: Filters;
    setFilters: (filters: Filters) => void;
    addStop: (stop: TripPoint) => void;
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
    const [searchPoint, setSearchPoint] = useState<TripPoint>();

    const {points: destinationRoutes, loading: destinationLoading} = useRouteSearchPoints({
        skip: !toId,
        variables: {id: toId || "", type: PointType.City, filters},
    });

    const {cityPoint: originPoint} = useCity(fromId ?? "", MapPointType.DESTINATION, !fromId);
    const {cityPoint: destinationPoint} = useCity(toId ?? "", MapPointType.DESTINATION, !toId);

    const {points: searchPoints, loading: searchLoading} = useRouteSearchPoints({
        skip: !(searchPoint ?? fromId),
        variables: {
            id: searchPoint?.id ?? fromId ?? "",
            type: fromId ? PointType.City : searchPoint?.type ?? PointType.Other,
            filters
        },
    });


    const addStop = useCallback((stop: TripPoint) => {
        setSearchPoint(stop);
    }, [setSearchPoint]);

    const points = useMemo(() => {
        const matchedSearchPoints = matchPoints(searchPoints ?? [], destinationRoutes);
        return [...originPoint ? [originPoint] : [], ...matchedSearchPoints, ...destinationPoint ? [destinationPoint] : []];
    }, [searchPoints, destinationRoutes]);


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
                {searchLoading && <MapLoader loadingText="Finding routes" color="info"/>}
            </Box>
        </RoutePlannerContext.Provider>);
}
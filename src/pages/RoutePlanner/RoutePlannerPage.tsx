import {Box, Stack} from "@mui/material";
import RoutePlannerMap from "../../components/RoutePlanner/RoutePlannerMap";
import {createContext, useCallback, useContext, useMemo, useState} from "react";
import {PointType, RouteStopOutput, RouteType} from "../../gql/graphql";
import {useParams} from "react-router-dom";
import {MapPointType, Point} from "../../components/common/maps/Point";
import useRouteSearchPoints from "../../components/RoutePlanner/useRouteSearchPoints";
import useCity from "../../components/RoutePlanner/useCity";
import MapLoader from "../../components/map/MapLoader";
import TripOverview from "../../components/RoutePlanner/TripOverview";
import {imgStreet} from "../../components/common/graphics/images";

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

export type Trip = {
    routeType: RouteType;
    durationHours?: number;
    durationMinutes?: number;
    durationTotal?: number;
}

export type TripPoint = RouteStopOutput & {
    pointType: PointType;
    origin?: boolean;
    destination?: boolean;
    trip?: Trip

}

type RoutePlannerContextState = {
    points: Point[];
    filters: Filters;
    setFilters: (filters: Filters) => void;
    addStop: (stop: TripPoint) => void;
    trip: TripPoint[]
}

const RoutePlannerContext = createContext<RoutePlannerContextState>({} as RoutePlannerContextState);

export function useRoutePlannerContext() {
    const context = useContext(RoutePlannerContext);
    return context;
}

function matchPoints(searchPoints: Point[], destinationPoints?: Point[]): Point[] {
    const destinationIds = Array.from(new Set(destinationPoints?.map(it => it.id)));
    return searchPoints.map((it) => ({
        ...it, match: destinationIds.includes(it.id)
    }));
}

export default function RoutePlannerPage() {
    const {fromId, toId} = useParams();
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [searchPoint, setSearchPoint] = useState<TripPoint>();
    const [addedPoints, setAddedPoints] = useState<TripPoint[]>([]);

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
            type: fromId ? PointType.City : searchPoint?.pointType ?? PointType.Other,
            filters
        },
    });

    const trip = useMemo(() => {
        const tripTable: TripPoint[] = [];
        if (originPoint) tripTable.push({
            id: originPoint.id,
            name: originPoint.label,
            pointType: PointType.Point,
            origin: true
        });
        tripTable.push(...addedPoints);
        if (destinationPoint) tripTable.push({
            id: destinationPoint.id,
            name: destinationPoint.label,
            pointType: PointType.Point,
            destination: true
        });
        return tripTable;
    }, [addedPoints, originPoint, destinationPoint]);

    const addStop = useCallback((stop: TripPoint) => {
        setAddedPoints((value) => [...value, stop]);
        setSearchPoint(stop);
    }, [setSearchPoint, setAddedPoints]);

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
                addStop,
                trip
            }}>
            <Stack direction="row" sx={styles.wrapper}>
                <TripOverview/>
                <Box flex={6}>
                    {searchLoading && <MapLoader loadingText="Finding routes" color="info"/>}
                    <RoutePlannerMap/>
                </Box>
            </Stack>
        </RoutePlannerContext.Provider>);
}

const styles = {
    wrapper: {
        backgroundImage: imgStreet,
        p: 1,
        flex: 1,
        borderRadius: 2
    }
};
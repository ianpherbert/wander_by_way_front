import {useQuery} from "@apollo/client";
import {
    FindAllRoutesDocument,
    FindAllRoutesQuery,
    FindAllRoutesQueryVariables,
    PointType,
    RouteSearchFilterInput
} from "../../gql/graphql";
import {Filters} from "../../pages/RoutePlanner/RoutePlannerPage";
import {MapPointType, Point} from "../common/maps/Point";
import {useMemo} from "react";


export type SearchPoint = {
    variables: {
        id: string,
        type: PointType,
        filters: RouteSearchFilterInput | Filters
    }
    skip?: boolean
}

export default function useRouteSearchPoints({variables, skip}: SearchPoint) {
    const {data, loading} = useQuery<
        FindAllRoutesQuery,
        FindAllRoutesQueryVariables
    >(FindAllRoutesDocument, {
        skip,
        variables: {...variables, filters: variables.filters as RouteSearchFilterInput}
    });

    const points: Point[] = useMemo(() => {
        return data?.findAllRoutes ? data.findAllRoutes.map((item) =>
            (
                {
                    id: item!.destinationId,
                    longitude: parseFloat(item!.longitude || "0"),
                    latitude: parseFloat(item!.latitude || "0"),
                    type: MapPointType.SEARCH_ITEM,
                    label: item!.destinationName || "",
                    routeInfo: {
                        routes: item!.routes || [],
                        durationAverage: item!.durationAverage || 0,
                        lineDistanceAverage: item!.lineDistanceAverage || 0
                    },
                }
            )
        ) : [];
    }, [data]);

    return {points: points, loading};
}
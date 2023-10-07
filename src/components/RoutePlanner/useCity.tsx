import {useQuery} from "@apollo/client";
import {CityOutput, FindCityByIdDocument, FindCityByIdQuery, FindCityByIdQueryVariables} from "../../gql/graphql";
import {useMemo} from "react";
import {MapPointType, Point} from "../common/maps/Point";

export default function useCity(cityId: string, type?: MapPointType, skip?: boolean) {
    const {
        data,
        loading,
    } = useQuery<FindCityByIdQuery, FindCityByIdQueryVariables>(FindCityByIdDocument, {
        skip: skip,
        variables: {cityId: cityId}
    });

    const city = useMemo(() => data ? data.findCityById as CityOutput : undefined, [data]);

    const cityPoint: Point | undefined = useMemo(() => {
        if (!city) {
            return undefined;
        }
        return {
            id: cityId,
            longitude: parseFloat(city.longitude || "0"),
            latitude: parseFloat(city.latitude || "0"),
            type: type ?? MapPointType.SEARCH_ITEM,
            label: city.name
        };
    }, [city]);

    return {city, loading, cityPoint};
}
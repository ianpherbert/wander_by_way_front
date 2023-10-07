import {useQuery} from "@apollo/client";
import {
    FindAllCitiesFromAssociatedTransitDocument,
    FindAllCitiesFromAssociatedTransitQuery,
    FindAllCitiesFromAssociatedTransitQueryVariables,
    StationType
} from "../../gql/graphql";

export default function useFindCityByTransit(
    id: string,
    transitType: StationType,
    name = "",
    skip?: boolean
) {
    const {
        data,
        loading
    } = useQuery<FindAllCitiesFromAssociatedTransitQuery, FindAllCitiesFromAssociatedTransitQueryVariables>(FindAllCitiesFromAssociatedTransitDocument,
        {
            skip: Boolean(skip),
            variables: {
                id: id,
                transitType,
                name,
            }
        });
    return {
        cities: data?.findAllCitiesFromAssociatedTransit,
        loading
    };
}
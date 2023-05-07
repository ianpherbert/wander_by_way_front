import {graphql} from "../gql";

export const SEARCH_CITY = graphql(`
                query SearchCity($query: String!){
                    searchCity(query: $query){
                        id
                        name
                        type
                        population
                        country
                        latitude
                        longitude
                    }
                }`);

export const GET_ROUTES_FROM_CITY = graphql(`
  query FindAllRoutes($id: String!, $type: PointType!, $filters: RouteSearchFilterInput!) {
    findAllRoutes(searchInput: { id: $id, type: $type, filters: $filters }) {
      destinationName
      destinationId
      latitude
      longitude
      routes {
        to {
          name
          latitude
          longitude
          id
          country
        }
        from {
          name
          latitude
          longitude
          id
          country
        }
        type
        durationTotal
        durationMinutes
        durationHours
        lineDistance
      }
      durationAverage
      lineDistanceAverage
    }
  }
`
);

export const FIND_CITY_BY_ID = graphql(`
    query FindCityById($cityId: String!){
        findCityById(cityId: $cityId){
            name
            type
            latitude
            longitude
        }
    }
`);

export const FIND_ALL_CITIES_FROM_ASSOCIATED_TRANSIT = graphql(`
    query FindAllCitiesFromAssociatedTransit(
        $id: String!,
        $transitType: StationType!,
        $name: String!
    ){
        findAllCitiesFromAssociatedTransit(
            transitSearchInput: {
                id: $id,
                transitType: $transitType,
                name: $name
            }
        ){
            id
            name
            type
            latitude
            longitude
        }
    }`
);
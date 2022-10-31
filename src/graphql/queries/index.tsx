import {gql} from '@apollo/client';

export const SEARCH_CITY = gql`
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
                }`;


export const GET_ROUTES_FROM_CITY = gql`
               query GetRoutesFromCity($cityId: String!) {
                    findAllRoutesFromCity(
                        cityId : $cityId
                    ){
                        destinationName
                        latitude
                        longitude
                        routes{
                            to{
                                name
                                latitude
                                longitude
                            }
                            from{
                                name
                                latitude
                                longitude
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

               }`

export const FIND_CITY_BY_ID = gql`
    query FindCityById($cityId: String!){
        findCityById(cityId: $cityId){
            name
            type
            latitude
            longitude
        }
    }
`




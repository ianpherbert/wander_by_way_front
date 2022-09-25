import {gql} from '@apollo/client';
import {CitySearchOutput, RouteSearchOutput} from "../model";




export interface SearchCityData{
    searchCity : CitySearchOutput[]
}

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

export interface GetRoutesFromCityData{
    findAllRoutesFromCity: RouteSearchOutput[]
}

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




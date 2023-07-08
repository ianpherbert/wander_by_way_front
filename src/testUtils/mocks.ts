import {SEARCH_CITY} from "../graphql";
import {MockedResponse} from "@apollo/client/testing";

const searchCityMocks = [
    {
        request: {
            query: SEARCH_CITY,
            variables: {
                query: ""
            }
        },
        result: {
            data: {
                "searchCity": []
            }
        }
    },
    {
        request: {
            query: SEARCH_CITY,
            variables: {
                query: "n"
            }
        },
        result: {
            data: {
                "searchCity": []
            }
        }
    },
    {
        request: {
            query: SEARCH_CITY,
            variables: {
                query: "na"
            }
        },
        result: {
            "data": {
                "searchCity": [
                    {
                        "id": "62d02351a28bff5743370216",
                        "name": "Poznan",
                        "type": "LARGECITY",
                        "population": 570352,
                        "latitude": "52.40692",
                        "longitude": "16.92993",
                        "country": "Poland"
                    },
                    {
                        "id": "62d02351a28bff5743370237",
                        "name": "Nantes",
                        "type": "MEDIUMCITY",
                        "population": 277269,
                        "latitude": "47.21725",
                        "longitude": "-1.55336",
                        "country": "France"
                    },
                ]
            }
        }
    }
];
export const mocks: MockedResponse[] = [...searchCityMocks];
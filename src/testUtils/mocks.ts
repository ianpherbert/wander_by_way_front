import {SEARCH_CITY} from "../graphql";

export const mocks = [
    {
        request: {
            query: SEARCH_CITY,
            variables: {
                name: "NANTES"
            }
        },
        result: {
            "data": {
                "searchCity": [
                    {
                        "id": "62d02351a28bff5743370216",
                        "name": "Poznań",
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
                    {
                        "id": "62d02351a28bff57433702e9",
                        "name": "Perpignan",
                        "type": "SMALLCITY",
                        "population": 110706,
                        "latitude": "42.69764",
                        "longitude": "2.89541",
                        "country": "France"
                    },
                    {
                        "id": "62d02351a28bff57433702ec",
                        "name": "Nancy",
                        "type": "SMALLCITY",
                        "population": 105334,
                        "latitude": "48.68439",
                        "longitude": "6.18496",
                        "country": "France"
                    },
                    {
                        "id": "62d02351a28bff57433704b7",
                        "name": "Nanterre",
                        "type": "TOWN",
                        "population": 86719,
                        "latitude": "48.89198",
                        "longitude": "2.20675",
                        "country": "France"
                    },
                    {
                        "id": "62d02351a28bff5743370605",
                        "name": "Legnano",
                        "type": "TOWN",
                        "population": 57589,
                        "latitude": "45.59788",
                        "longitude": "8.91506",
                        "country": "Italy"
                    },
                    {
                        "id": "62d02351a28bff5743370696",
                        "name": "San Fernando",
                        "type": "TOWN",
                        "population": 96366,
                        "latitude": "36.4759",
                        "longitude": "-6.19817",
                        "country": "Spain"
                    },
                    {
                        "id": "62d02352a28bff5743370961",
                        "name": "Letňany",
                        "type": "VILLAGE",
                        "population": 15862,
                        "latitude": "50.13333",
                        "longitude": "14.51667",
                        "country": "Czechia"
                    },
                    {
                        "id": "62d02352a28bff5743370a1a",
                        "name": "Draguignan",
                        "type": "VILLAGE",
                        "population": 38573,
                        "latitude": "43.53692",
                        "longitude": "6.46458",
                        "country": "France"
                    },
                    {
                        "id": "62d02352a28bff5743370a2b",
                        "name": "Marignane",
                        "type": "VILLAGE",
                        "population": 35873,
                        "latitude": "43.41727",
                        "longitude": "5.21462",
                        "country": "France"
                    },
                    {
                        "id": "62d02352a28bff5743370a4f",
                        "name": "Vandœuvre-lès-Nancy",
                        "type": "VILLAGE",
                        "population": 31785,
                        "latitude": "48.66115",
                        "longitude": "6.17114",
                        "country": "France"
                    },
                    {
                        "id": "62d02352a28bff5743370abb",
                        "name": "Gradignan",
                        "type": "VILLAGE",
                        "population": 24385,
                        "latitude": "44.77362",
                        "longitude": "-0.61395",
                        "country": "France"
                    },
                    {
                        "id": "62d02352a28bff5743370ad7",
                        "name": "Mont-Saint-Aignan",
                        "type": "VILLAGE",
                        "population": 23078,
                        "latitude": "49.46307",
                        "longitude": "1.09364",
                        "country": "France"
                    },
                    {
                        "id": "62d02352a28bff5743370ae9",
                        "name": "Frontignan",
                        "type": "VILLAGE",
                        "population": 22251,
                        "latitude": "43.44775",
                        "longitude": "3.75524",
                        "country": "France"
                    },
                    {
                        "id": "62d02352a28bff5743370bb0",
                        "name": "Villers-lès-Nancy",
                        "type": "VILLAGE",
                        "population": 15899,
                        "latitude": "48.67333",
                        "longitude": "6.15283",
                        "country": "France"
                    },
                    {
                        "id": "62d02352a28bff5743370c64",
                        "name": "Backnang",
                        "type": "VILLAGE",
                        "population": 35778,
                        "latitude": "48.94743",
                        "longitude": "9.43718",
                        "country": "Germany"
                    },
                    {
                        "id": "62d02352a28bff5743370e5a",
                        "name": "Tettnang",
                        "type": "VILLAGE",
                        "population": 18135,
                        "latitude": "47.66857",
                        "longitude": "9.59132",
                        "country": "Germany"
                    },
                    {
                        "id": "62d02352a28bff5743370f9b",
                        "name": "Hajdúnánás",
                        "type": "VILLAGE",
                        "population": 18032,
                        "latitude": "47.85",
                        "longitude": "21.43333",
                        "country": "Hungary"
                    },
                    {
                        "id": "62d02352a28bff5743370fe8",
                        "name": "Paderno Dugnano",
                        "type": "VILLAGE",
                        "population": 46235,
                        "latitude": "45.56899",
                        "longitude": "9.16483",
                        "country": "Italy"
                    },
                    {
                        "id": "62d02352a28bff5743371041",
                        "name": "Mugnano di Napoli",
                        "type": "VILLAGE",
                        "population": 34231,
                        "latitude": "40.90936",
                        "longitude": "14.20984",
                        "country": "Italy"
                    },
                    {
                        "id": "62d02352a28bff5743371079",
                        "name": "Gragnano",
                        "type": "VILLAGE",
                        "population": 29082,
                        "latitude": "40.68907",
                        "longitude": "14.52036",
                        "country": "Italy"
                    },
                    {
                        "id": "62d02352a28bff57433710c0",
                        "name": "Spinea-Orgnano",
                        "type": "VILLAGE",
                        "population": 23710,
                        "latitude": "45.49107",
                        "longitude": "12.155",
                        "country": "Italy"
                    },
                    {
                        "id": "62d02352a28bff57433710c1",
                        "name": "Putignano",
                        "type": "VILLAGE",
                        "population": 23661,
                        "latitude": "40.85106",
                        "longitude": "17.1219",
                        "country": "Italy"
                    },
                    {
                        "id": "62d02352a28bff57433710fd",
                        "name": "Arzignano",
                        "type": "VILLAGE",
                        "population": 21247,
                        "latitude": "45.52027",
                        "longitude": "11.33446",
                        "country": "Italy"
                    },
                    {
                        "id": "62d02352a28bff574337111f",
                        "name": "Rosignano Solvay-Castiglioncello",
                        "type": "VILLAGE",
                        "population": 19786,
                        "latitude": "43.38946",
                        "longitude": "10.43615",
                        "country": "Italy"
                    },
                    {
                        "id": "62d02352a28bff5743371141",
                        "name": "San Ferdinando",
                        "type": "VILLAGE",
                        "population": 18404,
                        "latitude": "40.83342",
                        "longitude": "14.24751",
                        "country": "Italy"
                    },
                    {
                        "id": "62d02352a28bff574337117a",
                        "name": "Melegnano",
                        "type": "VILLAGE",
                        "population": 16707,
                        "latitude": "45.35781",
                        "longitude": "9.3236",
                        "country": "Italy"
                    },
                    {
                        "id": "62d02352a28bff5743371181",
                        "name": "Alpignano",
                        "type": "VILLAGE",
                        "population": 16598,
                        "latitude": "45.09346",
                        "longitude": "7.52392",
                        "country": "Italy"
                    },
                    {
                        "id": "62d02352a28bff5743371425",
                        "name": "San Fernando de Henares",
                        "type": "VILLAGE",
                        "population": 40981,
                        "latitude": "40.42386",
                        "longitude": "-3.53261",
                        "country": "Spain"
                    },
                    {
                        "id": "62d02352a28bff57433714c4",
                        "name": "La Bonanova",
                        "type": "VILLAGE",
                        "population": 25574,
                        "latitude": "41.40585",
                        "longitude": "2.13243",
                        "country": "Spain"
                    },
                    {
                        "id": "62d02352a28bff5743371528",
                        "name": "Hernani",
                        "type": "VILLAGE",
                        "population": 20222,
                        "latitude": "43.26615",
                        "longitude": "-1.97615",
                        "country": "Spain"
                    },
                    {
                        "id": "62d02352a28bff57433718d2",
                        "name": "Nantwich",
                        "type": "VILLAGE",
                        "population": 17226,
                        "latitude": "53.06878",
                        "longitude": "-2.52051",
                        "country": "England"
                    }
                ]
            }
        }
    }
];
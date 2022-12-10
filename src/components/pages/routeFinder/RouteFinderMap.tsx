import React, {useEffect, useState} from "react";
import MapDisplay, {Point, PointType} from "../../common/maps/MapDisplay";
import "./index.scss"

import {useQuery} from "@apollo/client";
import {FIND_CITY_BY_ID, GET_ROUTES_FROM_CITY} from "../../../graphql/queries";
import {useParams} from "react-router-dom";
import {
    GetRoutesFromCity,
    GetRoutesFromCity_findAllRoutesFromCity_routes,
    GetRoutesFromCityVariables
} from "../../../graphql/model/GetRoutesFromCity";
import {FindCityById, FindCityByIdVariables} from "../../../graphql/model/FindCityById";
import {Stop} from "../../../core/trip/Stop";
import {mapTripIcons} from "../../../utils/mapTripIcons";
import {RouteType} from "../../../graphql/model/globalTypes";
import {formatTime} from "../../../utils/timeFormatter";
import Loader from "../../common/loader";


export const RouteFinderMap = () => {
    const {fromId, toId} = useParams();

    const [searchPoints, setPoints] = useState<Point[]>([]);
    const [stops, setStops] = useState<Stop[]>([]);
    const [trip, setTrip] = useState<Stop[]>([]);
    const [searchCity, setSearchCity] = useState<string | undefined>(fromId)

    const routesFromCity = useQuery<GetRoutesFromCity, GetRoutesFromCityVariables>(GET_ROUTES_FROM_CITY, {
        variables: { cityId:  searchCity || ""},
    });
    const originCity = useQuery<FindCityById, FindCityByIdVariables>(FIND_CITY_BY_ID,{
        variables: { cityId:  fromId || ""}
    })
    const destinationCity = useQuery<FindCityById, FindCityByIdVariables>(FIND_CITY_BY_ID,{
        variables: { cityId:  toId === "anywhere" ? "" : toId || ""}
    })

    useEffect(()=>{
        const searchRoutes = routesFromCity.data?.findAllRoutesFromCity?.map((item)=>
            (
                {longitude: parseFloat(item?.longitude || "0"),
                    latitude: parseFloat(item?.latitude|| "0"),
                    type: PointType.SEARCH_ITEM,
                    label: item?.destinationName || "",
                    routeInfo: {
                        routes: item?.routes || [],
                        durationAverage: item?.durationAverage || 0,
                        lineDistanceAverage: item?.lineDistanceAverage || 0
                    }
                }
            )
        ) || []
        const origin = {
            longitude: parseFloat(originCity.data?.findCityById?.longitude || "0"),
            latitude: parseFloat(originCity.data?.findCityById?.latitude|| "0"),
            type: PointType.ORIGIN,
            label: originCity.data?.findCityById?.name || ""
        }
        const routeStops = stops.map(stop=> (
            {longitude: parseFloat(stop.longitude),
                latitude: parseFloat(stop.latitude),
                type: PointType.INTERMEDIATE,
                label: stop.name,
                stopRouteInfo: {
                    durationMinutes:stop?.duration,
                    fromName: stop?.from,
                    type: stop?.routeType
                }
            }
        ))
        const destination = {
            longitude: parseFloat(destinationCity.data?.findCityById?.longitude || "0"),
            latitude: parseFloat(destinationCity.data?.findCityById?.latitude|| "0"),
            type: PointType.DESTINATION,
            label: destinationCity.data?.findCityById?.name || ""
        }
        if(routesFromCity.loading == false){
            setPoints([...searchRoutes,origin,...routeStops,destination]);
        }else{
            setPoints([origin,...routeStops,destination])
        }
    },[routesFromCity.loading, stops])

    useEffect(()=>{
        if(originCity.loading === false && destinationCity.loading === false){
            addStop(null)
        }
    },[originCity.loading, destinationCity.loading])

    const addStop = (route: GetRoutesFromCity_findAllRoutesFromCity_routes | null, addId?: string) =>{
        const tempTrip = []
        if(originCity?.data?.findCityById !== undefined){
            tempTrip.push({
                name: originCity.data?.findCityById?.name || "",
                routeType: RouteType.OTHER,
                origin: true,
                destination: false,
                duration: "0:00",
                latitude: originCity.data?.findCityById?.latitude || "0",
                longitude: originCity.data?.findCityById?.longitude || "0"
            })
        }
        if(route !== null){
            const newStop = {
                name: route?.to?.name || "",
                routeType: route?.type || RouteType.OTHER,
                origin: false,
                destination: false,
                duration: formatTime(route?.durationTotal || 0),
                latitude: route.to?.latitude || "0",
                longitude: route.to?.longitude || "0",
                from: route.from?.name || ""
            }
            tempTrip.push(...stops,newStop);
            setStops([...stops,newStop]);
            setSearchCity(addId);
        }
        if(destinationCity?.data?.findCityById !== undefined){
            tempTrip.push({
                name: destinationCity.data?.findCityById?.name || "",
                routeType: RouteType.OTHER,
                origin: false,
                destination: true,
                duration: "0:00",
                latitude: destinationCity.data?.findCityById?.latitude || "0",
                longitude: destinationCity.data?.findCityById?.longitude || "0"
            })
        }
        setTrip(tempTrip);
    }


    return (
        <div id={"routeFinderMap"}>
            <h3>{originCity.data?.findCityById?.name} to {destinationCity.data?.findCityById?.name || "Anywhere"}</h3>
            <div className={"map-navigation-wrapper"}>
                <div className={"navigation"}>
                    <div className={"route-preview"}>
                        {trip.map(stop =>
                            <>
                                {!stop.origin && <div className={"route-transit"}>
                                    <i className={"icofont-double-right"}/>
                                    <i className={mapTripIcons(stop.routeType)}/>
                                    <i className={"icofont-double-right"}/>
                                </div>}
                                <div className={"route-preview-item"}>
                                    <h4>{stop.name}</h4>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className={"trip-preview"}>
                </div>
                <div className={"map-wrapper"}>
                    <MapDisplay points={searchPoints} onAddStop={addStop}/>
                    {routesFromCity.loading && <Loader/>}
                </div>
            </div>
        </div>
    )
}

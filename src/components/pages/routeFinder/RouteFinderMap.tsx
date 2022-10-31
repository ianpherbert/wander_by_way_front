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


export const RouteFinderMap = () => {
    const {fromId, toId} = useParams();
    const routesFromCity = useQuery<GetRoutesFromCity, GetRoutesFromCityVariables>(GET_ROUTES_FROM_CITY, {
        variables: { cityId:  fromId || ""},
    });
    const originCity = useQuery<FindCityById, FindCityByIdVariables>(FIND_CITY_BY_ID,{
        variables: { cityId:  fromId || ""}
    })
    const destinationCity = useQuery<FindCityById, FindCityByIdVariables>(FIND_CITY_BY_ID,{
        variables: { cityId:  toId === "anywhere" ? "" : toId || ""}
    })

    const [searchPoints, setSearchPoints] = useState<Point[]>([]);
    const [stops, setStops] = useState<Stop[]>([]);
    const [trip, setTrip] = useState<Stop[]>([]);

    useEffect(()=>{
        if(routesFromCity.loading == false){
            const routes = routesFromCity.data?.findAllRoutesFromCity?.map((item)=>
                (
                    {longitude: item?.longitude || "",
                        latitude: item?.latitude|| "",
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
                longitude: originCity.data?.findCityById?.longitude || "",
                latitude: originCity.data?.findCityById?.latitude|| "",
                type: PointType.ORIGIN,
                label: originCity.data?.findCityById?.name || ""
            }
            const destination = {
                longitude: destinationCity.data?.findCityById?.longitude || "",
                latitude: destinationCity.data?.findCityById?.latitude|| "",
                type: PointType.DESTINATION,
                label: destinationCity.data?.findCityById?.name || ""
            }
            setSearchPoints([...routes,origin,destination]);
        }
    },[routesFromCity.loading])

    useEffect(()=>{
        if(originCity.loading === false && destinationCity.loading === false){
            addStop(null)
        }
    },[originCity.loading, destinationCity.loading])

    const addStop = (route: GetRoutesFromCity_findAllRoutesFromCity_routes | null) =>{
        const tempTrip = []
        if(originCity?.data?.findCityById !== undefined){
            tempTrip.push({
                name: originCity.data?.findCityById?.name || "",
                routeType: RouteType.OTHER,
                origin: true,
                destination: false,
                duration: "0:00"
            })
        }
        if(route !== null){
            const newStop = {
                name: route?.to?.name || "",
                routeType: route?.type || RouteType.OTHER,
                origin: false,
                destination: false,
                duration: formatTime(route?.durationTotal || 0)
            }
            tempTrip.push(...stops,newStop);
            setStops([...stops,newStop])
        }
        if(destinationCity?.data?.findCityById !== undefined){
            tempTrip.push({
                name: destinationCity.data?.findCityById?.name || "",
                routeType: RouteType.OTHER,
                origin: false,
                destination: true,
                duration: "0:00"
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
                                    <i className={"icofont-double-right"}></i>
                                    <i className={mapTripIcons(stop.routeType)}></i>
                                    <i className={"icofont-double-right"}></i>
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
                </div>
            </div>
        </div>
    )
}

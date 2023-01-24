import React, {useEffect, useState} from "react";
import MapDisplay, {Point, PointType} from "../../common/maps/MapDisplay";
import "./index.scss";

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
import matchRoutes from "./routeMatcher";
import TripOverviewItem from "./TripOverviewItem";


export const RouteFinderMap = () => {
    const {fromId, toId} = useParams();

    const [searchPoints, setPoints] = useState<Point[]>([]);
    const [stops, setStops] = useState<Stop[]>([]);
    const [trip, setTrip] = useState<Stop[]>([]);
    const [searchCity, setSearchCity] = useState<string | undefined>(fromId);
    const [update, setUpdate] = useState<boolean>(false);

    const routesFromCity = useQuery<GetRoutesFromCity, GetRoutesFromCityVariables>(GET_ROUTES_FROM_CITY, {
        variables: { cityId:  searchCity || ""},
    });
    const routesFromDestinationCity = useQuery<GetRoutesFromCity, GetRoutesFromCityVariables>(GET_ROUTES_FROM_CITY, {
        variables: { cityId:  toId || ""},
    });
    const originCity = useQuery<FindCityById, FindCityByIdVariables>(FIND_CITY_BY_ID,{
        variables: { cityId:  fromId || ""}
    });
    const destinationCity = useQuery<FindCityById, FindCityByIdVariables>(FIND_CITY_BY_ID,{
        variables: { cityId:  toId === "anywhere" ? "" : toId || ""}
    });
    const [destinationName, setDestinationName] = useState<string | null>(null);

    useEffect(()=>{
        if(routesFromDestinationCity.data && routesFromCity.data && searchPoints.length > 0 && update){
            const matches = matchRoutes(routesFromDestinationCity.data , routesFromCity.data);
            if(matches.length > 0) {
                const matchedPoints = searchPoints.map(point => {
                    if(matches.includes(point.label)){
                        point.match = true;
                    }
                    return point;
                });
                setPoints(matchedPoints);
                setUpdate(false);
            }
        }
    }, [searchPoints]);

    useEffect(()=>{
        setUpdate(true);
        const searchRoutes = routesFromCity.data?.findAllRoutesFromCity?.map((item)=>
            (
                {
                    id: stop.name,
                    longitude: parseFloat(item?.longitude || "0"),
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
        ) || [];
        const origin = {
            id: stop.name,
            longitude: parseFloat(originCity.data?.findCityById?.longitude || "0"),
            latitude: parseFloat(originCity.data?.findCityById?.latitude|| "0"),
            type: PointType.ORIGIN,
            label: originCity.data?.findCityById?.name || ""
        };
        const routeStops = stops.map(stop=> (
            {
                id: stop.name,
                longitude: parseFloat(stop.longitude),
                latitude: parseFloat(stop.latitude),
                type: PointType.INTERMEDIATE,
                label: stop.name,
                stopRouteInfo: {
                    durationMinutes:stop?.duration,
                    fromName: stop?.from,
                    type: stop?.routeType
                }
            }
        ));
        const destination = destinationName !== null ? {
            id: stops?.at(-1)?.id || "",
            longitude: parseFloat(stops?.at(-1)?.longitude || "0"),
            latitude: parseFloat(stops?.at(-1)?.latitude || "0"),
            type: PointType.DESTINATION,
            label: destinationName
        } : {
            id: stop.name,
            longitude: parseFloat(destinationCity.data?.findCityById?.longitude || "0"),
            latitude: parseFloat(destinationCity.data?.findCityById?.latitude|| "0"),
            type: PointType.DESTINATION,
            label: destinationCity.data?.findCityById?.name || ""
        };
        if(!routesFromCity.loading || destination){
            setPoints([...searchRoutes,origin,...routeStops,destination]);
        }else{
            setPoints([origin,...routeStops,destination]);
        }
    },[routesFromCity.data, stops]);

    useEffect(()=>{
        if(!originCity.loading && !destinationCity.loading){
            //Once loading is done, load the initial data
            addStop(null);
        }
    },[originCity.loading, destinationCity.loading]);

    const addStop = (route: GetRoutesFromCity_findAllRoutesFromCity_routes | null, addId?: string, destination?: boolean) =>{
        const tempTrip = [];
        // Add origin city from originCity Query
        if(originCity?.data?.findCityById !== undefined){
            tempTrip.push({
                id: fromId,
                name: originCity.data?.findCityById?.name || "",
                routeType: RouteType.OTHER,
                origin: true,
                destination:false,
                duration: "0:00",
                latitude: originCity.data?.findCityById?.latitude || "0",
                longitude: originCity.data?.findCityById?.longitude || "0"
            });
        }
        tempTrip.push(...stops);
        // Add new stop
        if(route !== null){
            const newStop = {
                id: addId || route?.to?.id,
                name: route?.to?.name || "",
                routeType: route?.type || RouteType.OTHER,
                origin: false,
                destination: destination || false,
                duration: formatTime(route?.durationTotal || 0),
                latitude: route.to?.latitude || "0",
                longitude: route.to?.longitude || "0",
                from: route.from?.name || ""
            };
            tempTrip.push(newStop);
            // Add new stop to stops
            setStops([...stops,newStop]);
            if(destination){
                // If the destinationName has been reached do not refetch
                setDestinationName(route?.to?.name);
                setSearchCity(undefined);
            }else{
                // Search new points from new stop
                setSearchCity(addId);
            }
        }
        // Add destinationName
        if(destinationCity?.data?.findCityById !== undefined && !destination){
            tempTrip.push({
                id: toId,
                name: destinationCity.data?.findCityById?.name || "",
                routeType: RouteType.OTHER,
                origin: false,
                destination: true,
                duration: "0:00",
                latitude: destinationCity.data?.findCityById?.latitude || "0",
                longitude: destinationCity.data?.findCityById?.longitude || "0"
            });
        }
        setTrip(tempTrip);
    };

    const resetStops= async (stop: Stop)=>{
        const index = stops.indexOf(stop);
        setDestinationName(null);
        const tempStops = stops;
        if(index === -1){
            tempStops.splice(0);
        }else{
            tempStops.splice(index+1);
        }
        setStops(tempStops);
        addStop(null);
        setSearchCity(stop?.id || "");
    };


    return (
        <div id={"routeFinderMap"}>
            <h3>{originCity.data?.findCityById?.name} to {destinationName || destinationCity.data?.findCityById?.name || "Anywhere"}</h3>
            <div className={"map-navigation-wrapper"}>
                <div className={"navigation"}>
                    <div className={"route-preview"}>
                        {trip.map(stop =>
                            <React.Fragment key={stop.id}>
                                {!stop.origin && <div className={"route-transit"}>
                                    <i className={"icofont-double-right"}/>
                                    <i className={mapTripIcons(stop.routeType)}/>
                                    <i className={"icofont-double-right"}/>
                                </div>}
                                <TripOverviewItem stop={stop} restart={resetStops}/>
                            </React.Fragment>
                        )}
                    </div>
                </div>
                <div className={"map-wrapper"}>
                    {routesFromDestinationCity.loading && <div className={"map-notification"}>
                        <p>Searching from {destinationName || destinationCity.data?.findCityById?.name}</p>
                    </div>}
                    <MapDisplay points={searchPoints} onAddStop={addStop}/>
                    {routesFromCity.loading && <Loader/>}
                </div>
            </div>
        </div>
    );
};

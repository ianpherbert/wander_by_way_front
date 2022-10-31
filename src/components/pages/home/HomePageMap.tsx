import React, {useEffect, useState} from "react";
import "./index.scss"
import "../../common/styles/map.scss"
import MapDisplay, {Point, PointType} from "../../common/maps/MapDisplay";
import {CssTextField} from "../../common/Mui/inputs";
import {ReverseButton} from "../../common/buttons/reverse";
import {WBWButton} from "../../common/buttons/wbwButton";
import {RouteType} from "../../../core/trip/RouteType";
import {Autocomplete, FormControl} from "@mui/material";
import {useQuery} from "@apollo/client";
import {SEARCH_CITY} from "../../../graphql/queries";
import {SearchCity, SearchCity_searchCity, SearchCityVariables} from "../../../graphql/model/SearchCity";
import {GetRoutesFromCity_findAllRoutesFromCity_routes} from "../../../graphql/model/GetRoutesFromCity";

enum InputType{
    TO,
    FROM,
    REASON
}

interface SelectedItems{
    to: SearchCity_searchCity | null,
    from: SearchCity_searchCity | null
}

const HomePageMap=()=>{
    const [toTerm, setToTerm] = useState<string>("");
    const [fromTerm, setFromTerm] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedItems, setSelectedItems] = useState<SelectedItems>({to: null, from: null});
    const [points, setPoints] = useState<Point[]>([])

    const citySearch = useQuery<SearchCity, SearchCityVariables>(SEARCH_CITY,{
        variables: {
            query: searchTerm
        }
    })

    const submit=()=>{
        window.location.href = `/routefinder/${selectedItems.from?.id}/${selectedItems.to?.id || "anywhere"}`;
    }

    const swapInputs=()=>{
        let tempSelect = selectedItems;
        let tempToTerm = toTerm;
        let tempFromTerm = fromTerm;
        setFromTerm(tempToTerm);
        setToTerm(tempFromTerm);
        setSelectedItems({
            to: tempSelect.from,
            from: tempSelect.to
        })
    }

    useEffect(()=>{
        const route = [];
        if(selectedItems.from !== null){
            route.push({latitude: selectedItems.from.latitude, longitude: selectedItems.from.longitude, type: PointType.ORIGIN, label: selectedItems.from.name, routeInfo: null})
        }
        if(selectedItems.to !== null){
            route.push({latitude: selectedItems.to.latitude, longitude: selectedItems.to.longitude, type: PointType.DESTINATION, label: selectedItems.to.name, routeInfo: null})
        }
        setPoints(route);
    },[selectedItems.to,selectedItems.from])


    const elevateTextInput = async (e: any, type: InputType) => {
        const input = e.target.value || ""

        switch (type){
            case InputType.FROM:
                setFromTerm(input);
                break;
            case InputType.TO:
                setToTerm(input);
                break;
        }
        await setSearchTerm(input);
        await citySearch.refetch();
    }

    const selectItem=(reason: string, item: string | SearchCity_searchCity | null, type: InputType)=>{
        let temp = selectedItems;
        if(typeof item === "string"){
            item = null
        }
        let displayName = "";
        if(item !== null){
            displayName = `${item?.name}, ${item?.country}`;
        }
        if(type === InputType.FROM){
            setFromTerm(displayName);
            temp.from = item;
        }else{
            setToTerm(displayName);
            temp.to = item;
        }
        setSelectedItems(temp);
    }

    return(
        <div id={"homepageMap"}>

            <h3>Where do you want to wander?</h3>
            <div className={"map-navigation-wrapper"}>
                <div className={"navigation"}>
                    <div className={"place-input"}>
                        <FormControl size="small">
                            <Autocomplete
                                id={"input-from"}
                                getOptionLabel={option => typeof option === "string" ? option : `${option?.name}, ${option?.country}` }
                                freeSolo
                                inputValue={fromTerm || ""}
                                options={citySearch.data?.searchCity || []}
                                onChange={(e: any, value: string | SearchCity_searchCity | null, reason: string)=> selectItem(reason, value, InputType.FROM)}
                                renderInput={
                                    (params) =>
                                        <CssTextField
                                            onBlur={()=>{selectedItems.from && setFromTerm(`${selectedItems.from.name}, ${selectedItems.from.country}`)}}
                                            {...params}
                                            label={"From"}
                                            onInputCapture={(e)=> elevateTextInput(e, InputType.FROM)}
                                        />}
                            />
                        </FormControl>
                            <ReverseButton onToggle={swapInputs}/>
                        <FormControl size="small">
                            <Autocomplete
                                id={"input-to"}
                                getOptionLabel={option => typeof option === "string" ? option : `${option?.name}, ${option?.country}` }
                                freeSolo
                                inputValue={toTerm || ""}
                                options={citySearch.data?.searchCity || []}
                                onChange={(e: any, value: string | SearchCity_searchCity | null, reason: string)=> selectItem(reason, value, InputType.TO)}
                                renderInput={
                                    (params) =>
                                        <CssTextField
                                            {...params}
                                            label={"To"}
                                            onInputCapture={(e)=> elevateTextInput(e, InputType.TO)}
                                            onBlur={()=>{selectedItems.to && setToTerm(`${selectedItems.to.name}, ${selectedItems.to.country}`)}}
                                        />}
                            />
                        </FormControl>
                    </div>
                        <WBWButton label={"Let's go"} onNext={()=>{submit()}}/>
                </div>
                <div className={"map-wrapper"}>
                    <MapDisplay points={points} onAddStop={(route: GetRoutesFromCity_findAllRoutesFromCity_routes)=>{}}/>
                </div>
            </div>
        </div>
    )
}

export default HomePageMap

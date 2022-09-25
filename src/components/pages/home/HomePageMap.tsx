import React, {useEffect, useState} from "react";
import "./index.scss"
import MapDisplay, {Point, PointType} from "../../common/maps/MapDisplay";
import {CssTextField} from "../../common/Mui/inputs";
import {ReverseButton} from "../../common/buttons/reverse";
import {WBWButton} from "../../common/buttons/wbwButton";
import {RouteType} from "../../../core/trip/RouteType";
import {CitySearchOutput, CityType, QuerySearchCityArgs} from "../../../graphql/model";
import {Autocomplete, FormControl} from "@mui/material";
import {useQuery} from "@apollo/client";
import {SEARCH_CITY, SearchCityData} from "../../../graphql/queries";

enum InputType{
    TO,
    FROM,
    REASON
}

interface SearchItems{
    toOptions: CitySearchOutput[],
    fromOptions: CitySearchOutput[]
}

interface SelectedItems{
    to: CitySearchOutput | null,
    from: CitySearchOutput | null
}

const HomePageMap=()=>{
    const [toTerm, setToTerm] = useState<string>("");
    const [fromTerm, setFromTerm] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedItems, setSelectedItems] = useState<SelectedItems>({to: null, from: null});
    const [points, setPoints] = useState<Point[]>([])

    const { loading, error, data } = useQuery(SEARCH_CITY, {
        variables: { query: searchTerm },
    });

    const submit=()=>{
        alert(`/${selectedItems.from?.id}/${selectedItems.to?.id || "anywhere"}`);
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
            route.push({latitude: selectedItems.from.latitude, longitude: selectedItems.from.longitude, type: PointType.ORIGIN, label: selectedItems.from.name, routeType: RouteType.ORIGIN})
        }
        if(selectedItems.to !== null){
            route.push({latitude: selectedItems.to.latitude, longitude: selectedItems.to.longitude, type: PointType.DESTINATION, label: selectedItems.to.name, routeType: RouteType.DESTINATION})
        }
        setPoints(route);
    },[selectedItems.to,selectedItems.from])


    const elevateTextInput = (e: any, type: InputType) => {
        const input = e.target.value || ""
        setSearchTerm(input);
        switch (type){
            case InputType.FROM:
                setFromTerm(input);
                break;
            case InputType.TO:
                setToTerm(input);
                break;
        }
    }

    const selectItem=(reason: string, item: string | CitySearchOutput | null, type: InputType)=>{
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
                                getOptionLabel={option => typeof option === "string" ? option : `${option.name}, ${option.country}` }
                                freeSolo
                                inputValue={fromTerm || ""}
                                options={data?.searchCity || []}
                                onChange={(e: any, value: string | CitySearchOutput | null, reason: string)=> selectItem(reason, value, InputType.FROM)}
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
                                getOptionLabel={option => typeof option === "string" ? option : `${option.name}, ${option.country}` }
                                freeSolo
                                inputValue={toTerm || ""}
                                options={data?.searchCity || []}
                                onChange={(e: any, value: string | CitySearchOutput | null, reason: string)=> selectItem(reason, value, InputType.TO)}
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
                    <MapDisplay points={points}/>
                </div>
            </div>
        </div>
    )
}

export default HomePageMap

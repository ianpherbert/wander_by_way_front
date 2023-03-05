import React, {useCallback, useState} from "react";
import "./skipfinder.scss";
import {Autocomplete, Button, FormControl} from "@mui/material";
import {SearchCity, SearchCity_searchCity, SearchCityVariables} from "../../../../../graphql/model/SearchCity";
import {CssTextField} from "../../../../common/mui/inputs";
import {useQuery} from "@apollo/client";
import {SEARCH_CITY} from "../../../../../graphql/queries";
import {Stop} from "../../../../../core/trip/Stop";
import {RouteType} from "../../../../../graphql/model/globalTypes";
import {WBWButton} from "../../../../common/buttons/wbwButton";

interface SkipFinderProps{
    open: boolean;
    onAddStop: (stop: Stop)=>void;

    from: string;
}

const SkipFinder =(props: SkipFinderProps)=>{
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedItem, setSelectedItem] = useState<SearchCity_searchCity | null>(null);
    const citySearch = useQuery<SearchCity, SearchCityVariables>(SEARCH_CITY,{
        variables: {
            query: searchTerm
        }
    });

    const selectItem=(reason: string, item: string | SearchCity_searchCity | null)=>{
        if(typeof item === "string"){
            setSelectedItem(null);
        }else{
            setSelectedItem(item);
        }
    };

    const addStop=()=>{
        if(selectedItem){
            const stop = {
                id: selectedItem.id,
                name: selectedItem.name,
                routeType: RouteType.CAR,
                origin: false,
                destination: false,
                duration: "0",
                latitude: selectedItem.latitude,
                longitude: selectedItem.longitude,
                from: props.from
            };
            props.onAddStop(stop);
        }
    };

    let count = 0.00;
    const changeSearchTerm =(e: any)=>{
        count = e.timeStamp;
        setTimeout(()=>{
            if(count - e.timeStamp === 0){
                setSearchTerm(e.target.value);
            }
        }, 400);
    };

    return (
        <div className={`skipFinder ${props.open && "open"}`}>
            <div>
                <FormControl size="small">
                    <Autocomplete
                        id={"input-from"}
                        getOptionLabel={option => typeof option === "string" ? option : `${option?.name}, ${option?.country}` }
                        freeSolo
                        options={citySearch.data?.searchCity || []}
                        onInput={(e: any)=> changeSearchTerm(e)}
                        onChange={(e: any, value: string | SearchCity_searchCity | null, reason: string)=> selectItem(reason, value)}
                        renderInput={
                            (params) =>
                                <CssTextField
                                    {...params}
                                    label={"Where to?"}
                                />}
                    />
                </FormControl>
                {selectedItem && <WBWButton label={`Add ${selectedItem?.name}`} onNext={addStop}/>}
                {/*{selectedItem && <Button onClick={addStop}></Button>}*/}
            </div>
        </div>
    );
};

export default SkipFinder;
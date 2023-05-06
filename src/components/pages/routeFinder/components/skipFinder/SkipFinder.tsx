import React, {useEffect, useState} from "react";
import "./skipfinder.scss";
import {Autocomplete, FormControl} from "@mui/material";
import {CssTextField} from "../../../../common/mui/inputs";
import {useQuery} from "@apollo/client";
import {Stop} from "../../../../../core/trip/Stop";
import {WBWButton} from "../../../../common/buttons/wbwButton";
import {
    CityOutput,
    RouteType,
    SearchCityDocument,
    SearchCityQuery,
    SearchCityQueryVariables
} from "../../../../../gql/graphql";

interface SkipFinderProps {
    open: boolean;
    onAddStop: (stop: Stop) => void;

    from: string;
}

const SkipFinder = (props: SkipFinderProps) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedItem, setSelectedItem] = useState<CityOutput | null>(null);
    const citySearch = useQuery<SearchCityQuery, SearchCityQueryVariables>(SearchCityDocument, {
        variables: {
            query: searchTerm
        }
    });

    const {open, onAddStop, from} = props;

    useEffect(() => {
        setSearchTerm("");
        setSelectedItem(null);
    }, [open]);

    const selectItem = (reason: string, item: string | CityOutput | null) => {
        if (typeof item === "string") {
            setSelectedItem(null);
        } else {
            setSelectedItem(item);
        }
    };

    const addStop = () => {
        if (selectedItem) {
            const stop = {
                id: selectedItem.id,
                name: selectedItem.name,
                routeType: RouteType.Car,
                origin: false,
                destination: false,
                duration: "0",
                latitude: selectedItem.latitude,
                longitude: selectedItem.longitude,
                from
            };
            onAddStop(stop);
        }
    };

    let count = 0.00;
    const changeSearchTerm = (e: any) => {
        count = e.timeStamp;
        setTimeout(() => {
            if (count - e.timeStamp === 0) {
                setSearchTerm(e.target.value);
            }
        }, 400);
    };

    return (
        <div className={`skipFinder ${open && "open"}`}>
            <div>
                <FormControl size="small">
                    <Autocomplete
                        id={"input-from"}
                        getOptionLabel={option => typeof option === "string" ? option : `${option?.name}, ${option?.country}`}
                        freeSolo
                        value={searchTerm}
                        options={citySearch.data?.searchCity || []}
                        onInput={(e: any) => changeSearchTerm(e)}
                        onChange={(e: any, value: string | CityOutput | null, reason: string) => selectItem(reason, value)}
                        renderInput={
                            (params) =>
                                <CssTextField
                                    {...params}
                                    label={"Where to?"}
                                />}
                    />
                </FormControl>
                {selectedItem && <WBWButton label={`Add ${selectedItem?.name}`} onNext={addStop}/>}
            </div>
        </div>
    );
};

export default SkipFinder;
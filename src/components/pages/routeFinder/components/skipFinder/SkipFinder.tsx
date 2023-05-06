import React, {useEffect, useState} from "react";
import "./skipfinder.scss";
import {Autocomplete, Button, FormControl} from "@mui/material";
import {CssTextField} from "../../../../common/mui/inputs";
import {useQuery} from "@apollo/client";
import {Stop} from "../../../../../core/trip/Stop";
import {
    CityOutput,
    RouteType,
    SearchCityDocument,
    SearchCityQuery,
    SearchCityQueryVariables
} from "../../../../../gql/graphql";
import {mapTripIcons} from "../../../../../utils/mapTripIcons";
import {truncateString} from "../../../../../utils/stringFormat";

interface SkipFinderProps {
    open: boolean;
    onAddStop: (stop: Stop) => void;

    from: string;
}

const SkipFinder = (props: SkipFinderProps) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedItem, setSelectedItem] = useState<CityOutput | null>(null);
    const [activeType, setActiveType] = useState<RouteType | null>();
    const [selectedActiveType, setSelectedActiveType] = useState<RouteType | null>(null);
    const citySearch = useQuery<SearchCityQuery, SearchCityQueryVariables>(SearchCityDocument, {
        variables: {
            query: searchTerm
        }
    });

    const {open, onAddStop, from} = props;

    useEffect(() => {
        setSearchTerm("");
        setSelectedItem(null);
        setActiveType(null);
        setSelectedActiveType(null);
    }, [open]);

    const selectItem = (reason: string, item: string | CityOutput | null) => {
        if (typeof item === "string") {
            setSelectedItem(null);
        } else {
            setSelectedItem(item);
        }
    };

    const addStop = () => {
        if (selectedItem && selectedActiveType) {
            const stop = {
                id: selectedItem.id,
                name: selectedItem.name,
                routeType: selectedActiveType,
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

    function mouseEnter(routeType: RouteType) {
        setActiveType(routeType);
    }

    function mouseExit(routeType: RouteType) {
        if (!activeType) {
            setActiveType(null);
        } else {
            setActiveType(selectedActiveType);
        }

    }

    function onSelectType(routeType: RouteType) {
        setSelectedActiveType(routeType);
    }

    function buttonText() {
        return buttonDisabled() ? "Select a destination and mode" : `Go to ${truncateString(selectedItem!.name)} by ${selectedActiveType}`;
    }

    function buttonDisabled() {
        return selectedActiveType === null || selectedItem === null;
    }

    return (
        <div className={`skipFinder ${open && "open"}`}>
            <div>
                <div className={"input-wrapper"}>
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
                </div>

                <div className={"type-icons"}>
                    {Object.values(RouteType).map((it) => (
                        <i key={it}
                            className={`${mapTripIcons(it)} ${activeType && activeType !== it ? "inactive" : "active"}`}
                            onMouseEnter={() => {
                                mouseEnter(it);
                            }} onMouseLeave={() => {
                                mouseExit(it);
                            }} onClick={() => {
                                onSelectType(it);
                            }}/>
                    ))}
                </div>
                <div className={"go-button-wrapper"}>
                    <Button onClick={addStop} disabled={buttonDisabled()}
                        variant="contained">{buttonText()}</Button>
                </div>
            </div>
        </div>
    );
};

export default SkipFinder;
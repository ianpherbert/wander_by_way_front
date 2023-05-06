import React, {useEffect, useState} from "react";
import "./index.scss";
import "../../common/styles/map.scss";
import MapDisplay from "../../common/maps/MapDisplay";
import {MapPointType} from "../../common/maps/Point";
import {ReverseButton} from "../../common/buttons/reverse";
import {WBWButton} from "../../common/buttons/wbwButton";
import {Autocomplete, FormControl} from "@mui/material";
import {useQuery} from "@apollo/client";
import {CssTextField} from "../../common/mui/inputs";
import {CityOutput, SearchCityDocument, SearchCityQuery, SearchCityQueryVariables} from "../../../gql/graphql";
import {setSearchPoints} from "../../../redux/map/mapSlice";
import {useDispatch} from "react-redux";

enum InputType {
    TO,
    FROM,
    REASON
}

interface SelectedItems {
    to: CityOutput | null,
    from: CityOutput | null
}

const HomePageMap = () => {
    const [toTerm, setToTerm] = useState<string>("");
    const [fromTerm, setFromTerm] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedItems, setSelectedItems] = useState<SelectedItems>({to: null, from: null});

    const dispatch = useDispatch();

    const citySearch = useQuery<SearchCityQuery, SearchCityQueryVariables>(SearchCityDocument, {
        variables: {
            query: searchTerm
        }
    });

    const submit = () => {
        window.location.href = `/routefinder/${selectedItems.from?.id}/${selectedItems.to?.id || "anywhere"}`;
    };

    const swapInputs = () => {
        const tempSelect = selectedItems;
        const tempToTerm = toTerm;
        const tempFromTerm = fromTerm;
        setFromTerm(tempToTerm);
        setToTerm(tempFromTerm);
        setSelectedItems({
            to: tempSelect.from,
            from: tempSelect.to
        });
    };

    useEffect(() => {
        const route = [];
        if (selectedItems.from !== null) {
            route.push({
                id: selectedItems.from.id,
                latitude: parseFloat(selectedItems.from.latitude),
                longitude: parseFloat(selectedItems.from.longitude),
                type: MapPointType.ORIGIN,
                label: selectedItems.from.name,
                routeInfo: null
            });
        }
        if (selectedItems.to !== null) {
            route.push({
                id: selectedItems.to.id,
                latitude: parseFloat(selectedItems.to.latitude),
                longitude: parseFloat(selectedItems.to.longitude),
                type: MapPointType.DESTINATION,
                label: selectedItems.to.name,
                routeInfo: null
            });
        }
        dispatch(setSearchPoints(route));
    }, [selectedItems.to, selectedItems.from]);


    const elevateTextInput = async (e: any, type: InputType) => {
        const input = e.target.value || "";

        switch (type) {
        case InputType.FROM:
            setFromTerm(input);
            break;
        case InputType.TO:
            setToTerm(input);
            break;
        }
        await setSearchTerm(input);
        await citySearch.refetch();
    };

    const selectItem = (reason: string, item: string | CityOutput | null, type: InputType) => {
        const temp = selectedItems;
        if (typeof item === "string") {
            item = null;
        }
        let displayName = "";
        if (item !== null) {
            displayName = `${item?.name}, ${item?.country}`;
        }
        if (type === InputType.FROM) {
            setFromTerm(displayName);
            temp.from = item;
        } else {
            setToTerm(displayName);
            temp.to = item;
        }
        setSelectedItems(temp);
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
        <div id={"homepageMap"}>

            <h3>Where do you want to wander?</h3>
            <div className={"map-navigation-wrapper"}>
                <div className={"navigation"}>
                    <div className={"place-input"}>
                        <FormControl size="small">
                            <Autocomplete
                                id={"input-from"}
                                getOptionLabel={option => typeof option === "string" ? option : `${option?.name}, ${option?.country}`}
                                freeSolo
                                inputValue={fromTerm || ""}
                                onInput={(e: any) => changeSearchTerm(e)}
                                options={citySearch.data?.searchCity || []}
                                onChange={(e: any, value: string | CityOutput | null, reason: string) => selectItem(reason, value, InputType.FROM)}
                                renderInput={
                                    (params) =>
                                        <CssTextField
                                            onBlur={() => {
                                                selectedItems.from && setFromTerm(`${selectedItems.from.name}, ${selectedItems.from.country}`);
                                            }}
                                            {...params}
                                            label={"From"}
                                            onInputCapture={(e) => elevateTextInput(e, InputType.FROM)}
                                        />}
                            />
                        </FormControl>
                        <ReverseButton onToggle={swapInputs}/>
                        <FormControl size="small">
                            <Autocomplete
                                id={"input-to"}
                                getOptionLabel={option => typeof option === "string" ? option : `${option?.name}, ${option?.country}`}
                                freeSolo
                                inputValue={toTerm || ""}
                                options={citySearch.data?.searchCity || []}
                                onChange={(e: any, value: string | CityOutput | null, reason: string) => selectItem(reason, value, InputType.TO)}
                                renderInput={
                                    (params) =>
                                        <CssTextField
                                            {...params}
                                            label={"To"}
                                            onInputCapture={(e) => elevateTextInput(e, InputType.TO)}
                                            onBlur={() => {
                                                selectedItems.to && setToTerm(`${selectedItems.to.name}, ${selectedItems.to.country}`);
                                            }}
                                        />}
                            />
                        </FormControl>
                    </div>
                    <WBWButton label={"Let's go"} onNext={() => {
                        submit();
                    }}/>
                </div>
                <div className={"map-wrapper"}>
                    <MapDisplay/>
                </div>
            </div>
        </div>
    );
};

export default HomePageMap;

import React, {FormEvent, useEffect, useState} from "react";
import "../../common/styles/map.scss";
import MapDisplay from "../../common/maps/MapDisplay";
import {MapPointType} from "../../common/maps/Point";
import {Autocomplete, Box, Button, FormControl, Typography} from "@mui/material";
import {useQuery} from "@apollo/client";
import {CssTextField} from "../../common/mui/inputs";
import {CityOutput, SearchCityDocument, SearchCityQuery, SearchCityQueryVariables} from "../../../gql/graphql";
import {setSearchPoints} from "../../../redux/map/mapSlice";
import {useDispatch} from "react-redux";
import {mapContainerStyle, navBoxStyle} from "./homePageStyles";
import {Snowshoeing, SwapHoriz} from "@mui/icons-material";
import {mapStyle} from "../../common/styles/mapStyle";

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


    const elevateTextInput = async (e: FormEvent<HTMLDivElement>, type: InputType) => {
        const input = getInputValue(e);

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
    const changeSearchTerm = (e: FormEvent<HTMLDivElement>) => {
        count = e.timeStamp;
        setTimeout(() => {
            if (count - e.timeStamp === 0) {
                setSearchTerm(getInputValue(e));
            }
        }, 400);
    };

    function resetSearchTerm() {
        setSearchTerm("");
    }

    function getInputValue(e: FormEvent<HTMLDivElement | HTMLInputElement>) {
        return (e.target as HTMLInputElement).value;
    }

    return (
        <Box sx={mapContainerStyle}>
            <Typography variant={"h4"}>Where do you want to wander?</Typography>
            <Box sx={mapStyle.navigationWrapper}>
                <Box sx={navBoxStyle}>
                    <FormControl size="small">
                        <Autocomplete
                            getOptionLabel={option => typeof option === "string" ? option : `${option?.name}, ${option?.country}`}
                            freeSolo
                            inputValue={fromTerm || ""}
                            onFocus={resetSearchTerm}
                            onInput={(e: FormEvent<HTMLDivElement>) => changeSearchTerm(e)}
                            options={citySearch.data?.searchCity as CityOutput[] || []}
                            filterOptions={(options, state) => {
                                const regex = new RegExp(state.inputValue.replace(/[- ]/g, '[- ]'), 'i');
                                return options.filter(string => regex.test(string.name));
                            }}
                            onChange={(e, value: string | CityOutput | null, reason: string) => selectItem(reason, value, InputType.FROM)}
                            renderInput={
                                (params) =>
                                    <CssTextField
                                        onBlur={() => {
                                            selectedItems.from && setFromTerm(`${selectedItems.from.name}, ${selectedItems.from.country}`);
                                        }}
                                        {...params}
                                        label={"From"}
                                        onInputCapture={(e: FormEvent<HTMLInputElement>) => elevateTextInput(e, InputType.FROM)}
                                    />}
                        />
                    </FormControl>
                    <FormControl size="small">
                        <Autocomplete
                            getOptionLabel={option => typeof option === "string" ? option : `${option?.name}, ${option?.country}`}
                            freeSolo
                            onFocus={resetSearchTerm}
                            inputValue={toTerm || ""}
                            options={citySearch.data?.searchCity as CityOutput[] || []}
                            onChange={(e, value: string | CityOutput | null, reason: string) => selectItem(reason, value, InputType.TO)}
                            filterOptions={(options, state) => {
                                const regex = new RegExp(state.inputValue.replace(/[- ]/g, '[- ]'), 'i');
                                return options.filter(string => regex.test(string.name));
                            }}
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
                    <Button variant="contained" endIcon={<SwapHoriz/>} onClick={swapInputs}>swap</Button>
                    <Button variant="contained" endIcon={<Snowshoeing/>} onClick={submit}
                        disabled={!selectedItems.from}>
                        {"Let's Go!"}
                    </Button>
                </Box>
                <Box sx={mapStyle.wrapper}>
                    <MapDisplay/>
                </Box>
            </Box>
        </Box>
    );
};

export default HomePageMap;

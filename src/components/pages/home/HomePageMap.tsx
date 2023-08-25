import React, {SyntheticEvent, useCallback, useEffect, useState} from "react";
import "../../common/styles/map.scss";
import MapDisplay from "../../common/maps/MapDisplay";
import {MapPointType} from "../../common/maps/Point";
import {Box, Button, IconButton, Stack, Typography} from "@mui/material";
import {CityOutput} from "../../../gql/graphql";
import {setSearchPoints} from "../../../redux/map/mapSlice";
import {useDispatch} from "react-redux";
import {mapContainerStyle} from "./homePageStyles";
import {ExploreOutlined, SwapHoriz} from "@mui/icons-material";
import {mapStyle} from "../../common/styles/mapStyle";
import CitySearchInput from "../../common/Input/CitySearchInput";
import {useNavigate} from "react-router-dom";

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
    const [fromCity, setFromCity] = useState<CityOutput | null>(null);
    const [toCity, setToCity] = useState<CityOutput | null>(null);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const submit = useCallback(() => {
        navigate(`/routefinder/${fromCity?.id}/${toCity?.id || "anywhere"}`);
    }, [fromCity, toCity]);

    const swapInputs = useCallback(() => {
        const tempTo = toCity;
        const tempFrom = fromCity;
        setFromCity(tempTo);
        setToCity(tempFrom);
    }, [fromCity, toCity]);

    useEffect(() => {
        const route = [];
        if (fromCity !== null) {
            route.push({
                id: fromCity.id,
                latitude: parseFloat(fromCity.latitude),
                longitude: parseFloat(fromCity.longitude),
                type: MapPointType.ORIGIN,
                label: fromCity.name,
                routeInfo: null
            });
        }
        if (toCity !== null) {
            route.push({
                id: toCity.id,
                latitude: parseFloat(toCity.latitude),
                longitude: parseFloat(toCity.longitude),
                type: MapPointType.DESTINATION,
                label: toCity.name,
                routeInfo: null
            });
        }
        dispatch(setSearchPoints(route));
    }, [toCity, fromCity]);

    const selectCity = useCallback((type: "from" | "to") => (_: SyntheticEvent, value: CityOutput | null) => type === "from" ? setFromCity(value) : setToCity(value)
        , [setFromCity, setToCity]);


    return (
        <Box sx={mapContainerStyle}>s
            <Typography variant={"h4"}>Where do you want to wander?</Typography>
            <Box sx={mapStyle.navigationWrapper}>
                <Stack direction="row" spacing={1} mx={2}>
                    <CitySearchInput
                        size="small"
                        label={"From"}
                        onChange={selectCity("from")}
                        fullWidth
                        value={fromCity}/>
                    <IconButton onClick={swapInputs} color="secondary">
                        <SwapHoriz/>
                    </IconButton>
                    <CitySearchInput
                        size="small"
                        label={"To"}
                        fullWidth
                        onChange={selectCity("to")}
                        value={toCity}/>

                    <Button
                        fullWidth
                        size="small"
                        variant="contained"
                        endIcon={<ExploreOutlined/>}
                        onClick={submit}
                        disabled={!fromCity}>
                        {"Let's Go!"}
                    </Button>
                </Stack>
                <Box sx={mapStyle.wrapper}>
                    <MapDisplay/>
                </Box>
            </Box>
        </Box>
    );
};

export default HomePageMap;

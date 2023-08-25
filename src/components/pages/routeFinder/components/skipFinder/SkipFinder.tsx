import React, {FormEvent, useEffect, useMemo, useState} from "react";
import {
    Autocomplete,
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Stack,
    TextField
} from "@mui/material";
import {useQuery} from "@apollo/client";
import {Stop} from "../../../../../core/trip/Stop";
import {
    CityOutput,
    RouteType,
    SearchCityDocument,
    SearchCityQuery,
    SearchCityQueryVariables
} from "../../../../../gql/graphql";
import {mapTripIcons} from "../../../../../utils/mapTripIconsIcofont";
import {truncateString} from "../../../../../utils/stringFormat";
import getInputValue from "../../../../../utils/getInputValue";
import _toLower from "lodash/toLower";
import {debounce} from "lodash";

interface SkipFinderProps {
    open: boolean;
    onAddStop: (stop: Stop) => void;
    from: string;
    onClose: () => void
}


const SkipFinder = ({open, onAddStop, from, onClose}: SkipFinderProps) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedItem, setSelectedItem] = useState<CityOutput | null>(null);
    const [activeType, setActiveType] = useState<RouteType | null>();
    const citySearch = useQuery<SearchCityQuery, SearchCityQueryVariables>(SearchCityDocument, {
        variables: {
            query: searchTerm
        }
    });


    useEffect(() => {
        setSearchTerm("");
        setSelectedItem(null);
        setActiveType(null);
    }, [open]);

    const selectItem = (reason: string, item: string | CityOutput | null) => {
        if (typeof item === "string") {
            setSelectedItem(null);
        } else {
            setSelectedItem(item);
        }
    };

    const addStop = () => {
        if (selectedItem && activeType) {
            const stop = {
                id: selectedItem.id,
                name: selectedItem.name,
                routeType: activeType,
                origin: false,
                destination: false,
                duration: "0",
                latitude: selectedItem.latitude,
                longitude: selectedItem.longitude,
                from,
                isCity: true
            };
            onAddStop(stop);
        }
    };

    const changeSearchTerm = debounce((e: FormEvent<HTMLDivElement>) => {
        setSearchTerm(getInputValue(e));
    }, 400);

    const titleText = useMemo(() => {
        const activeTypeLabel = activeType && _toLower(activeType);
        if (Boolean(activeType) && Boolean(selectedItem)) {
            return `Go to ${truncateString(selectedItem?.name)} by ${activeTypeLabel}`;
        }
        if (Boolean(activeType) && !selectedItem) {
            return `Go somewhere by ${activeTypeLabel}`;
        }
        if (!activeType && Boolean(selectedItem)) {
            return `Go to ${truncateString(selectedItem?.name)}`;
        }

        return "Add Custom stop";

    }, [activeType, selectedItem]);

    const buttonDisabled = useMemo(() => activeType === null || selectedItem === null, [activeType, selectedItem]);

    return (
        <Dialog open={open} maxWidth="xl">
            <DialogTitle sx={{textAlign: 'center', color: '#4a4a4a'}}>{titleText}</DialogTitle>
            <DialogContent>
                <Stack direction="row" display="flex" spacing={2} mt={2}>
                    <FormControl size="small" fullWidth>
                        <Autocomplete
                            id={"input-from"}
                            getOptionLabel={option => typeof option === "string" ? option : `${option?.name}, ${option?.country}`}
                            freeSolo
                            size="small"
                            value={searchTerm}
                            options={citySearch.data?.searchCity as CityOutput[] || []}
                            onInput={(e) => changeSearchTerm(e)}
                            onChange={(e, value: string | CityOutput | null, reason: string) => selectItem(reason, value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={"Where to?"}
                                    variant="outlined"
                                />
                            )}
                        />

                    </FormControl>
                    <Button fullWidth size="small" onClick={addStop}
                        disabled={buttonDisabled}
                        variant="contained"
                        color="primary" endIcon={activeType && mapTripIcons(activeType)}>Let&apos;s
                        Go</Button>
                </Stack>
                <ButtonGroup color="info"
                    style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginTop: '10px'}}>
                    {Object.values(RouteType).map((it) => (
                        <Button
                            key={it}
                            onClick={() => setActiveType(it)}
                            endIcon={mapTripIcons(it)}
                            variant={activeType === it ? "contained" : "outlined"}
                        >
                            {it}
                        </Button>
                    ))}
                </ButtonGroup>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    color="secondary"
                    variant="contained"
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SkipFinder;
import React, {SyntheticEvent, useCallback, useEffect, useMemo, useState} from "react";
import {
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Stack
} from "@mui/material";
import {Stop} from "../../../../../core/trip/Stop";
import {CityOutput, RouteType,} from "../../../../../gql/graphql";
import {mapTripIcons} from "../../../../../utils/mapTripIconsIcofont";
import {truncateString} from "../../../../../utils/stringFormat";
import _toLower from "lodash/toLower";
import CitySearchInput from "../../../../common/Input/CitySearchInput";

interface SkipFinderProps {
    open: boolean;
    onAddStop: (stop: Stop) => void;
    from: string;
    onClose: () => void
}


const SkipFinder = ({open, onAddStop, from, onClose}: SkipFinderProps) => {
    const [selectedItem, setSelectedItem] = useState<CityOutput | null>(null);
    const [activeType, setActiveType] = useState<RouteType | null>();

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

    const selectItem = useCallback((_: SyntheticEvent, value: CityOutput | null) => {
        setSelectedItem(value);
    }, [setSelectedItem]);

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

    useEffect(() => {
        setSelectedItem(null);
        setActiveType(null);
    }, [open]);

    return (
        <Dialog open={open} maxWidth="xl">
            <DialogTitle sx={{textAlign: 'center', color: '#4a4a4a'}}>{titleText}</DialogTitle>
            <DialogContent>
                <Stack direction="row" display="flex" spacing={2} mt={2}>
                    <FormControl size="small" fullWidth>
                        <CitySearchInput value={selectedItem}
                            onChange={selectItem}
                            id={"input-from"} size="small" label="Where to?"/>
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
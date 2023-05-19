import "./toolbar.scss";
import React, {useState} from "react";
import {FormControlLabel, Grid, Radio, Switch, ToggleButton, Tooltip} from "@mui/material";
import {
    FilterName,
    toggleAutoZoom,
    toggleFilter,
    toggleShowConnections,
    useAutoZoom,
    useFilters,
    useShowConnections
} from "../../../../redux/map/mapSlice";
import {useDispatch} from "react-redux";
import {ExpandMore, Settings} from "@mui/icons-material";

export const Toolbar = () => {
    const dispatch = useDispatch();
    const filters = useFilters();
    const showConnections = useShowConnections();
    const autoZoom = useAutoZoom();

    const filterNames: FilterName[] = ["connections", "route", "flight", "train", "bus", "ferry"];

    const [open, setOpen] = useState<boolean>(false);

    function action(e: MouseEvent, filter: FilterName) {
        dispatch(toggleFilter(filter));
    }

    function changeShowConnections() {
        dispatch(toggleShowConnections());
    }

    function changeAutoZoom() {
        dispatch(toggleAutoZoom());
    }


    return (
        <aside className={`toolbar ${open ? "" : "closed"}`}>
            <div className={"toolbar-title"}>
                {open && <h4>Map Settings</h4>}
                <div className={"toggle"}>
                    <Tooltip title={open ? "Close Map Settings" : "Open Map Settings"}>
                        <ToggleButton
                            value="check"
                            selected={open}
                            onChange={() => {
                                setOpen(!open);
                            }}
                            size={"small"}
                        >
                            {open ? <ExpandMore/> : <Settings/>}
                        </ToggleButton>
                    </Tooltip>
                </div>
            </div>
            <div className={"toolbar-body"}>
                <Grid container>
                    <Grid xs={6}>
                        <h5>Filters</h5>
                        {filterNames.map((name) =>
                            <Grid key={name} xs={12}>
                                <FormControlLabel control={<Radio onMouseUp={(e) => {
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    action(e, name);
                                }} checked={filters[name].applied} disabled={!filters[name].active}/>} label={name}/>
                            </Grid>)}
                    </Grid>
                    <Grid xs={6}>
                        <Grid xs={12}>
                            <h5>Settings</h5>
                            <FormControlLabel
                                control={<Switch checked={showConnections} onClick={changeShowConnections}/>}
                                label="Highlight Connections"/>
                            <FormControlLabel
                                control={<Switch checked={autoZoom} onClick={changeAutoZoom}/>}
                                label="Auto Zoom"/>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </aside>
    );
};
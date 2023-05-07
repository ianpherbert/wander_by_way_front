import "./toolbar.scss";
import React, {useState} from "react";
import {Grid, Radio, ToggleButton} from "@mui/material";
import {FilterName, toggleFilter, useFilters} from "../../../../redux/map/mapSlice";
import {useDispatch} from "react-redux";
import {ChevronRight, ExpandMore} from "@mui/icons-material";

export const Toolbar = () => {
    const dispatch = useDispatch();
    const filters = useFilters();

    const filterNames: FilterName[] = ["connections", "route", "flight", "train", "bus", "ferry"];

    const [open, setOpen] = useState<boolean>(false);

    function action(e: MouseEvent, filter: FilterName) {
        dispatch(toggleFilter(filter));
    }

    const gridStyle = {
        item: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }
    };


    return (
        <aside className={`toolbar ${open ? "" : "closed"}`}>
            <div className={"toolbar-title"}>
                <h4>Filters</h4>
                <ToggleButton
                    value="check"
                    selected={open}
                    onChange={() => {
                        setOpen(!open);
                    }}
                    size={"small"}
                >
                    {open ? <ExpandMore/> : <ChevronRight/>}
                </ToggleButton></div>
            <div className={"toolbar-body"}>
                <Grid container>
                    {filterNames.map((name) => <Grid container key={name}><Grid xs={3}><Radio onMouseUp={(e) => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        action(e, name);
                    }} checked={filters[name].applied} disabled={!filters[name].active}/></Grid><Grid xs={9}
                        style={gridStyle.item}>{name}</Grid>
                    </Grid>)}
                </Grid>
            </div>
        </aside>
    );
};
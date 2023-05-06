import "./toolbar.scss";
import React from "react";
import {Grid, Radio} from "@mui/material";
import {FilterName, toggleFilter, useFilters} from "../../../../redux/map/mapSlice";
import {useDispatch} from "react-redux";

export const Toolbar = () => {
    const dispatch = useDispatch();
    const filters = useFilters();

    const filterNames: FilterName[] = ["connections", "flight", "train", "bus", "ferry"];

    function action(e: MouseEvent, filter: FilterName) {
        dispatch(toggleFilter(filter));
    }

    const gridStyle = {
        title: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50px",
        },
        item: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }
    };

    return (
        <aside id={"toolbar"}>
            <Grid container>
                <Grid xs={12} style={gridStyle.title}><span>Filters</span></Grid>
                {filterNames.map((name) => <Grid container key={name}><Grid xs={3}><Radio onMouseUp={(e) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    action(e, name);
                }} checked={filters[name].applied} disabled={!filters[name].active}/></Grid><Grid xs={9}
                    style={gridStyle.item}>{name}</Grid>
                </Grid>)}

            </Grid>
        </aside>
    );
};
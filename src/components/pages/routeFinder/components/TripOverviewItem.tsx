import React from "react";
import {Stop} from "../../../../core/trip/Stop";
import {Button, IconButton, Tooltip} from "@mui/material";
import {SouthWestRounded} from "@mui/icons-material";

interface TripOverviewItemProps{
    stop: Stop,
    restart: (stop: Stop) => void
}

const TripOverviewItem=(props: TripOverviewItemProps)=>{
    const icon = () => {
        if(props.stop.origin){
            return <i className="icofont-google-map"/>;
        } else if(props.stop.destination){
            return <i className="icofont-racing-flag"/>;
        } 
        return <i className="icofont-google-map"/>;
        
    };

    const className = () =>{
        let name = "route-preview-item ";
        if(props.stop.origin){
            name += "preview-origin";
        } else if(props.stop.destination){
            name += "preview-destination";
        }else{
            name += "preview-stop";
        }
        return name;
    };

    return (
        <div className={"route-preview-item-wrapper"}>
            {
                <div className={className()}>
                    {icon()}
                    <h4>{props.stop.name || "Anywhere"}</h4>
                    {!props.stop.destination && <div className={"preview-item-expand"}>
                        <Tooltip title={"Start over here"}>
                            <IconButton aria-label="delete"
                                onClick={()=> {
                                    props.restart(props.stop);
                                }}
                            >
                                <SouthWestRounded/>
                            </IconButton>
                        </Tooltip>
                    </div>}
                </div>
            }
        </div>
    );
};

export default TripOverviewItem;
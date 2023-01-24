import React from "react";
import "./index.scss";

export const WBWButton=(props:{onNext?:()=>void, label: string})=>{
    return(
        <div className={"wbw-button"} onClick={props.onNext}>
            <div className={"wbw-button-bg"}>
                <div className={"wbw-button-bg-chevron red"}/>
                <div className={"wbw-button-bg-chevron yellow"}/>
                <div className={"wbw-button-bg-chevron teal"}/>
            </div>
            <div className={"button-text"}>
                <span>{props.label}</span>
            </div>
        </div>
    );
};

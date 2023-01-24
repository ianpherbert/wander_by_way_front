import React from "react";
import "./index.scss";

interface LoaderProps{
    solid?: boolean;
    size?: number;
}

const Loader=(props: LoaderProps)=>{
    return (
        <div id={"loader"} className={props.solid ? "solid" : ""} style={{height: `${props.size}px` || "80px"}}>
            <div className={`chevrons`}>
                <div className={"chevron teal"}/>
                <div className={"chevron yellow"}/>
                <div className={"chevron red"}/>
                <div className={"chevron_spacer"}/>
                <div className={"chevron teal"}/>
                <div className={"chevron yellow"}/>
                <div className={"chevron red"}/>
            </div>
        </div>
    );
};

export default Loader;

import React from "react";
import "./index.scss"

interface LoaderProps{
    solid?: Boolean
}

const Loader=(props: LoaderProps)=>{
    return (
        <div id={"loader"} className={props.solid && "solid"}>
            <div className={`chevrons`}>
                <div className={"chevron teal"}></div>
                <div className={"chevron yellow"}></div>
                <div className={"chevron red"}></div>
                <div className={"chevron_spacer"}></div>
                <div className={"chevron teal"}></div>
                <div className={"chevron yellow"}></div>
                <div className={"chevron red"}></div>
            </div>
        </div>
    );
}

export default Loader

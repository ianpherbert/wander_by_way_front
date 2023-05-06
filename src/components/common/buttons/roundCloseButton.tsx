import React from "react";

interface roundCloseButtonProps{
    onClose: ()=>void,
    left: boolean,
    visible?: boolean
}

export const RoundCloseButton=(props: roundCloseButtonProps)=>{
    return (
        <div hidden={props.visible} className={`roundClose ${props.left ? "left" : "right"}`} onClick={props.onClose}><i className="icofont-close"></i></div>
    );
};

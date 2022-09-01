import React from "react";
import "./index.scss"

export const ReverseButton = (props: {
    onToggle:
        () => void
}) => {

    return (
        <div className={"reverse-button"} onClick={props.onToggle}>
            <i className={"icofont icofont-retweet"}/>
        </div>
    )
}

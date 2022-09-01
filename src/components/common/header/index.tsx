import React from "react";
import "./index.scss";
import {Languages} from "../../../utils/Languages";

interface HeaderProps{
    connected: boolean,
    username?: string,
    language: Languages
}

const Header = (props: HeaderProps) => {

    console.log(props)

    const flagLink = props.language == Languages.FR ? "/languageIcons/FR.png" : "/languageIcons/EN.png"

    return(
        <div id={"header"}>
            <a className={"title"} href="/home">
                <h1>Wander</h1>
                <h1 className={"red"}>by</h1>
                <h1>Way</h1>
            </a>

            <div className={"connection"}>
                <div className={"log-in-wrapper"}>
                    <a className={"log-in"} href={"/login"}>
                        {props.connected ? props.username || "Your account" : "Log In"}
                        <i className="icofont-user-alt-7"/>
                    </a>
                </div>
                <div className={"flag-link"}>
                    <img src={flagLink} />
                </div>
            </div>
        </div>
    )
}

export default Header

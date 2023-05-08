import React from "react";
import {CookieConsent} from "react-cookie-consent";
import {randomHello} from "../../utils/randomHello";

export const CookieConsentObject = () => {

    const style = {
        popup: {
            background: "#2B373B"
        },
        link: {
            color: "white",
            fontWeight: "bold"
        },
        button: {
            background: "#da4167",
            color: "#333533",
            fontSize: "13px",
            width: "250px",
            height: "50px",
            borderRadius: "3px"
        }
    };


    return (
        <CookieConsent
            location="bottom"
            buttonText="Got it!"
            cookieName="cookieConsent"
            style={style.popup}
            buttonStyle={style.button}><p>{randomHello()}! Before you explore our website, please be aware that we use
            cookies and similar
            technologies to
            enhance your experience. By clicking &lsquo;Accept&lsquo;, you&lsquo;ll be giving us your ticket to
            personalize content, and provide the best user experience possible, as described in our <a
                style={style.link}
                href={"/privacy"}>Privacy
                Policy</a>.</p></CookieConsent>
    );
};
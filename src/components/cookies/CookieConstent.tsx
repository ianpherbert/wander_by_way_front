import React from "react";
import {CookieConsent} from "react-cookie-consent";

export const CookieConsentObject = () => {
    return (
        <CookieConsent
            location="bottom"
            buttonText="Got it!"
            cookieName="cookieConsent"
            style={{background: "#2B373B"}}
            buttonStyle={{
                color: "#4e503b",
                fontSize: "13px"
            }}>{"Our website uses cookies🍪 to enhance the user experience"}</CookieConsent>
    );
};
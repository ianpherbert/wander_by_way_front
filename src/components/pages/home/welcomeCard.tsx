import React from "react";
import "./index.scss";
import {Chevron} from "../../common/chevron/Chevron";

const WelcomeCard = () => {
    return (
        <div id={"welcomeCard"}>
            <div className={"welcome-card-text"}>
                <h3>Wander.</h3>
                <p>
                    Welcome to Wander by Way, your ultimate travel planning tool. Discover new and exciting destinations with our comprehensive route planner. Find all available transportation options, including trains, planes, buses, and ferries, from your starting city. Create personalized routes that take you off the beaten path and explore the world in a whole new way. Our site is designed to be a helpful resource in your travel planning, providing you with all the information you need to plan your next adventure.
                </p>
            </div>
            <Chevron/>
        </div>
    );
};

export default WelcomeCard;

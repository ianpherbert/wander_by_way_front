import React, {useState} from "react";
import "./index.scss";
import {Chevron} from "../../common/chevron/Chevron";
import {randomHello} from "../../../utils/randomHello";
import {hello} from "../../../names/hello";

const WelcomeCard = () => {
    const [hellos, setHellos] = useState<string[]>([randomHello()]);

    setInterval(() => {

        let random = randomHello();
        if (hellos.length === hello.length) {
            setHellos([random]);
        } else {
            while (hellos.includes(random)) {
                random = randomHello();
            }
            setHellos([random]);
        }
        //This number needs to correspond to the fadeIn animation duration
    }, 5000);

    return (
        <div id={"welcomeCard"}>
            <div className={"welcome-card-text"}>
                <div id={"hello-container"}>
                    {hellos.map(it => (<h3 key={it}>{it},</h3>))}
                </div>
                <p>
                    Welcome to Wander by Way, your ultimate travel planning tool. Discover new and exciting destinations
                    with our comprehensive route planner. Find all available transportation options, including trains,
                    planes, buses, and ferries, from your starting city. Create personalized routes that take you off
                    the beaten path and explore the world in a whole new way. Our site is designed to be a helpful
                    resource in your travel planning, providing you with all the information you need to plan your next
                    adventure.
                </p>
            </div>
            <Chevron/>
        </div>
    );
};

export default WelcomeCard;

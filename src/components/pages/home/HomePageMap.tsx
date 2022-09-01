import React, {useState} from "react";
import "./index.scss"
import Map, {PointType} from "../../common/maps/Map";
import {CustomAutocomplete, CustomSelect, SelectItem} from "../../common/Mui/inputs";
import {ReverseButton} from "../../common/buttons/reverse";
import {WBWButton} from "../../common/buttons/wbwButton";

class Inputs{
    constructor(to?: string, from?: string, reason?: string) {
        this.to = to;
        this.from = from;
        this.reason = reason;
    }
    to?: string;
    from?: string;
    reason?: string;
}

enum InputType{
    TO,
    FROM,
    REASON
}

const HomePageMap=()=>{
    const [routeTerm, setRouteTerm] = useState<Inputs>(new Inputs());

    const submit=()=>{
        alert("submit");
    }

    const swapInputs=()=>{
        setRouteTerm(new Inputs(routeTerm.from,routeTerm.to,routeTerm.reason))
    }

    const buildrouteTerm=(value: string, input: InputType)=>{
        let term = routeTerm;
        switch (input){
            case InputType.FROM:
                term.from = value;
                break;
            case InputType.TO:
                term.to = value;
                break;
            case InputType.REASON:
                term.reason = value;
                break;
        }
        setRouteTerm(term);
    }

    const selectOptions = [new SelectItem("ecology", "ecology"), new SelectItem("price", "price"),new SelectItem("time", "time")]

    const route = [
        {latitude: "47.2", longitude: "-1.31", type: PointType.ORIGIN, label: "Nantes"},
        {latitude: "48", longitude: "7", type: PointType.INTERMEDIATE, label: "Strasbourg"},
        {latitude: "49", longitude: "8", type: PointType.LAYOVER, label: "Mannheim"},
        {latitude: "53.53", longitude: "9.72", type: PointType.INTERMEDIATE, label: "Hambourg"},
        {latitude: "53.8", longitude: "10.85", type: PointType.INTERMEDIATE, label: "Lübeck"},
        {latitude: "55", longitude: "13", type: PointType.INTERMEDIATE, label: "Malmö"},
        {latitude: "59", longitude: "18", type: PointType.DESTINATION, label: "Stockholm"}
    ]

    return(
        <div id={"homepageMap"}>
            <h3>Where do you want to wander?</h3>
            <div className={"map-navigation-wrapper"}>
                <div className={"navigation"}>
                    <div className={"place-input"}>
                        <CustomAutocomplete label={"From"} onTextInput={(inputText)=>buildrouteTerm(inputText, InputType.FROM)} options={[]} enterKey={submit}/>
                            <ReverseButton onToggle={()=>console.log("toggle")}/>
                        <CustomAutocomplete label={"To"} onTextInput={(inputText)=>buildrouteTerm(inputText,InputType.TO)} options={[]} enterKey={submit}/>
                    </div>
                        <WBWButton label={"Let's go"}/>
                </div>
                <div className={"map-wrapper"}>
                    <Map points={route}/>
                </div>
            </div>
        </div>
    )
}

export default HomePageMap

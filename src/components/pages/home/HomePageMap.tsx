import React, {useEffect, useState} from "react";
import "./index.scss"
import Map, {PointType} from "../../common/maps/Map";
import {CustomAutocomplete, CustomSelect, SelectItem} from "../../common/Mui/inputs";
import {ReverseButton} from "../../common/buttons/reverse";
import {WBWButton} from "../../common/buttons/wbwButton";
import {PointSearchItem, PointSearchType} from "../../../utils/PointSearchItem";

class Inputs{
    constructor(to?: string, from?: string, reason?: string) {
        this.to = to;
        this.from = from;
    }
    to?: string;
    from?: string;
}

enum InputType{
    TO,
    FROM,
    REASON
}

class SearchOptions{
    constructor(toOptions: PointSearchItem[], fromOptions: PointSearchItem[]) {
        this.toOptions = toOptions?.sort((a,b)=> a.matchCoefficient > b.matchCoefficient ? 1 : -1) || [];
        this.fromOptions = fromOptions?.sort((a,b)=> a.matchCoefficient > b.matchCoefficient ? 1 : -1) || [];
    }
    toOptions: PointSearchItem[];
    fromOptions: PointSearchItem[];
}

const HomePageMap=()=>{
    const [routeTerm, setRouteTerm] = useState<Inputs>(new Inputs());
    const [searchItems, setSearchItems] = useState<SearchOptions>()

    const submit=()=>{
        alert("submit");
    }

    const swapInputs=()=>{
        setRouteTerm(new Inputs(routeTerm.from,routeTerm.to))
    }

    const buildRouteTerm=(value: string, input: InputType)=>{
        let term = routeTerm;
        switch (input){
            case InputType.FROM:
                term.from = value;
                break;
            case InputType.TO:
                term.to = value;
                break;
        }
        setRouteTerm(term);
        //Search
        const options = new SearchOptions(
            [
                new PointSearchItem("option1","123",PointSearchType.CITY, .20),
                new PointSearchItem("option2","1234",PointSearchType.CITY, .12),
                new PointSearchItem("option3","1233",PointSearchType.CITY, 1),
                new PointSearchItem("option4","1231",PointSearchType.CITY, .77),
            ],
            [
                new PointSearchItem("option1","123d",PointSearchType.CITY, 1),
                new PointSearchItem("option2","123a",PointSearchType.CITY, .001),
                new PointSearchItem("option3","123d",PointSearchType.CITY, .8),
                new PointSearchItem("option4","123s",PointSearchType.CITY, .002),
            ]
        )
        setSearchItems(options)
    }

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
                        <CustomAutocomplete label={"From"} onTextInput={(inputText)=>buildRouteTerm(inputText, InputType.FROM)} options={searchItems?.fromOptions!!} enterKey={submit}/>
                            <ReverseButton onToggle={()=>console.log("toggle")}/>
                        <CustomAutocomplete label={"To"} onTextInput={(inputText)=>buildRouteTerm(inputText,InputType.TO)} options={searchItems?.toOptions!!} enterKey={submit}/>
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

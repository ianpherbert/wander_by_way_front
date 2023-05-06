import {Point} from "../components/common/maps/Point";

export class PointSearchItem{
    constructor(displayName: string, id: string, type: PointSearchType, matchCoefficient: number) {
        this.displayName = displayName;
        this.id = id;
        this.type = type;
        this.matchCoefficient = matchCoefficient;
    }
    displayName: string;
    id: string;
    type: PointSearchType;
    matchCoefficient: number;
}

export enum PointSearchType{
    STATION,
    AIRPORT,
    CITY,
    OTHER
}

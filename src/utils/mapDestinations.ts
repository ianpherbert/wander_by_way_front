import {CityType} from "../graphql/model/globalTypes";


export function mapCityIcons(type: CityType): string {
    let iconClass;
    switch (type) {
        case CityType.MEGACITY:
        case CityType.MEDIUMCITY:
        case CityType.LARGECITY:
        case CityType.SMALLCITY:
            iconClass = "icofont-building-alt"
            break;
        case CityType.TOWN:
        case CityType.VILLAGE:
            iconClass = "icofont-ui-home"
            break;
        default:
            iconClass = "icofont-ui-home"
    }
    return iconClass
}

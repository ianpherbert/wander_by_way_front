import {CityType} from "../gql/graphql";


export function mapCityIcons(type: CityType): string {
    let iconClass;
    switch (type) {
    case CityType.Megacity:
    case CityType.Mediumcity:
    case CityType.Largecity:
    case CityType.Smallcity:
        iconClass = "icofont-building-alt";
        break;
    case CityType.Town:
    case CityType.Village:
        iconClass = "icofont-ui-home";
        break;
    default:
        iconClass = "icofont-ui-home";
    }
    return iconClass;
}

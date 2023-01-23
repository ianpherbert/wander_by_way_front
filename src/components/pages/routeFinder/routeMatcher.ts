import {GetRoutesFromCity} from "../../../graphql/model/GetRoutesFromCity";

const matchRoutes=(from: GetRoutesFromCity, to: GetRoutesFromCity) : string[]=>{
    const toNames = to.findAllRoutesFromCity.map((it) => it?.destinationName);
    return from.findAllRoutesFromCity.filter((it) =>
        toNames.includes(it?.destinationName || "")
    ).map(it => it?.destinationName|| "");
};

export default matchRoutes;
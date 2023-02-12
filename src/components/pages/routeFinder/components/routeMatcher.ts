import {GetRoutesFromCity} from "../../../../graphql/model/GetRoutesFromCity";

const matchRoutes=(from: GetRoutesFromCity, to: GetRoutesFromCity) : string[]=>{
    const toNames = to.findAllRoutesFromCity.map((it) => it?.destinationName);
    const toIds = to.findAllRoutesFromCity.map((it) => it?.destinationId);
    return from.findAllRoutesFromCity.filter((it) =>
        toNames.includes(it?.destinationName) || toIds.includes(it?.destinationId)
    ).map(it => it?.destinationName|| "");
};

export default matchRoutes;
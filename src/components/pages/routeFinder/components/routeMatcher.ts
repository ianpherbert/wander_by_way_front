
import {FindAllRoutesQuery} from "../../../../gql/graphql";

const matchRoutes=(from: FindAllRoutesQuery, to: FindAllRoutesQuery) : string[]=>{
    const toNames = to.findAllRoutes.map((it) => it?.destinationName);
    const toIds = to.findAllRoutes.map((it) => it?.destinationId);
    return from.findAllRoutes.filter((it) =>
        toNames.includes(it?.destinationName) || toIds.includes(it?.destinationId)
    ).map(it => it?.destinationName|| "");
};

export default matchRoutes;
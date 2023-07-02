import {FindAllRoutesQuery} from "../../../../gql/graphql";

/**
 * This function matches routes based on their destination name or destination id from two sets of routes.
 *
 * @param {FindAllRoutesQuery} from - An object containing the first set of routes.
 * @param {FindAllRoutesQuery} to - An object containing the second set of routes.
 * @returns {string[]} - An array of destination names that are present in both the first and second set of routes.
 */
const matchRoutes = (from: FindAllRoutesQuery, to: FindAllRoutesQuery): string[] => {
    const toNames = to.findAllRoutes.map((it) => it?.destinationName);
    const toIds = to.findAllRoutes.map((it) => it?.destinationId);
    return from.findAllRoutes.filter((it) =>
        toNames.includes(it?.destinationName) || toIds.includes(it?.destinationId)
    ).map(it => it?.destinationName || "");
};

export default matchRoutes;
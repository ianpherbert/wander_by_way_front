import {RouteSearchOutput} from "../../../gql/graphql";


/**
 * This function matches routes based on their destination name or destination id from two sets of routes.
 *
 * @param  from - The first set of routes.
 * @param  to - The second set of routes.
 * @returns {string[]} - An array of destination names that are present in both the first and second set of routes.
 */
const matchRoutes = (from: RouteSearchOutput[], to: RouteSearchOutput[]): string[] => {
    const toNames = to.map((it) => it?.destinationName);
    const toIds = to.map((it) => it?.destinationId);
    return from.filter((it) =>
        toNames.includes(it?.destinationName) || toIds.includes(it?.destinationId)
    ).map(it => it?.destinationName || "");
};

export default matchRoutes;
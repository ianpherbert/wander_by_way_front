/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n                query SearchCity($query: String!){\n                    searchCity(query: $query){\n                        id\n                        name\n                        type\n                        population\n                        country\n                        latitude\n                        longitude\n                    }\n                }": types.SearchCityDocument,
    "\n  query FindAllRoutes($id: String!, $type: PointType!, $filters: RouteSearchFilterInput!) {\n    findAllRoutes(searchInput: { id: $id, type: $type, filters: $filters }) {\n      destinationName\n      destinationId\n      latitude\n      longitude\n      routes {\n        to {\n          name\n          latitude\n          longitude\n          id\n          country\n        }\n        from {\n          name\n          latitude\n          longitude\n          id\n          country\n        }\n        type\n        durationTotal\n        durationMinutes\n        durationHours\n        lineDistance\n      }\n      durationAverage\n      lineDistanceAverage\n    }\n  }\n": types.FindAllRoutesDocument,
    "\n    query FindCityById($cityId: String!){\n        findCityById(cityId: $cityId){\n            name\n            type\n            latitude\n            longitude\n        }\n    }\n": types.FindCityByIdDocument,
    "\n    query FindAllCitiesFromAssociatedTransit(\n        $id: String!,\n        $transitType: StationType!,\n        $name: String!\n    ){\n        findAllCitiesFromAssociatedTransit(\n            transitSearchInput: {\n                id: $id,\n                transitType: $transitType,\n                name: $name\n            }\n        ){\n            id\n            name\n            type\n            latitude\n            longitude\n        }\n    }": types.FindAllCitiesFromAssociatedTransitDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n                query SearchCity($query: String!){\n                    searchCity(query: $query){\n                        id\n                        name\n                        type\n                        population\n                        country\n                        latitude\n                        longitude\n                    }\n                }"): (typeof documents)["\n                query SearchCity($query: String!){\n                    searchCity(query: $query){\n                        id\n                        name\n                        type\n                        population\n                        country\n                        latitude\n                        longitude\n                    }\n                }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FindAllRoutes($id: String!, $type: PointType!, $filters: RouteSearchFilterInput!) {\n    findAllRoutes(searchInput: { id: $id, type: $type, filters: $filters }) {\n      destinationName\n      destinationId\n      latitude\n      longitude\n      routes {\n        to {\n          name\n          latitude\n          longitude\n          id\n          country\n        }\n        from {\n          name\n          latitude\n          longitude\n          id\n          country\n        }\n        type\n        durationTotal\n        durationMinutes\n        durationHours\n        lineDistance\n      }\n      durationAverage\n      lineDistanceAverage\n    }\n  }\n"): (typeof documents)["\n  query FindAllRoutes($id: String!, $type: PointType!, $filters: RouteSearchFilterInput!) {\n    findAllRoutes(searchInput: { id: $id, type: $type, filters: $filters }) {\n      destinationName\n      destinationId\n      latitude\n      longitude\n      routes {\n        to {\n          name\n          latitude\n          longitude\n          id\n          country\n        }\n        from {\n          name\n          latitude\n          longitude\n          id\n          country\n        }\n        type\n        durationTotal\n        durationMinutes\n        durationHours\n        lineDistance\n      }\n      durationAverage\n      lineDistanceAverage\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query FindCityById($cityId: String!){\n        findCityById(cityId: $cityId){\n            name\n            type\n            latitude\n            longitude\n        }\n    }\n"): (typeof documents)["\n    query FindCityById($cityId: String!){\n        findCityById(cityId: $cityId){\n            name\n            type\n            latitude\n            longitude\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query FindAllCitiesFromAssociatedTransit(\n        $id: String!,\n        $transitType: StationType!,\n        $name: String!\n    ){\n        findAllCitiesFromAssociatedTransit(\n            transitSearchInput: {\n                id: $id,\n                transitType: $transitType,\n                name: $name\n            }\n        ){\n            id\n            name\n            type\n            latitude\n            longitude\n        }\n    }"): (typeof documents)["\n    query FindAllCitiesFromAssociatedTransit(\n        $id: String!,\n        $transitType: StationType!,\n        $name: String!\n    ){\n        findAllCitiesFromAssociatedTransit(\n            transitSearchInput: {\n                id: $id,\n                transitType: $transitType,\n                name: $name\n            }\n        ){\n            id\n            name\n            type\n            latitude\n            longitude\n        }\n    }"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
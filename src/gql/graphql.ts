/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AirportLocationOutput = {
  __typename?: 'AirportLocationOutput';
  cities?: Maybe<Array<Maybe<Scalars['String']>>>;
  country?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
};

export type AirportOutput = {
  __typename?: 'AirportOutput';
  iata?: Maybe<Scalars['String']>;
  icao?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  latitude: Scalars['String'];
  location?: Maybe<AirportLocationOutput>;
  longitude: Scalars['String'];
  name: Scalars['String'];
};

export type AirportSearchOutput = {
  __typename?: 'AirportSearchOutput';
  cities: Array<Maybe<Scalars['String']>>;
  country?: Maybe<Scalars['String']>;
  iata?: Maybe<Scalars['String']>;
  icao?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};

export type CityAirportOutput = {
  __typename?: 'CityAirportOutput';
  airportId: Scalars['String'];
  iata?: Maybe<Scalars['String']>;
  icao: Scalars['String'];
  latitude: Scalars['String'];
  longitude: Scalars['String'];
  name: Scalars['String'];
};

export type CityOutput = {
  __typename?: 'CityOutput';
  airports: Array<Maybe<CityAirportOutput>>;
  country: Scalars['String'];
  id: Scalars['String'];
  latitude: Scalars['String'];
  longitude: Scalars['String'];
  name: Scalars['String'];
  population: Scalars['Int'];
  trainStations: Array<Maybe<CityStationOutput>>;
  type: CityType;
};

export type CitySearchOutput = {
  __typename?: 'CitySearchOutput';
  cityType: CityType;
  country: Scalars['String'];
  id: Scalars['String'];
  latitude: Scalars['String'];
  longitude: Scalars['String'];
  name: Scalars['String'];
  population: Scalars['Int'];
};

export type CityStationOutput = {
  __typename?: 'CityStationOutput';
  latitude: Scalars['String'];
  longitude: Scalars['String'];
  name: Scalars['String'];
  stationId: Scalars['String'];
  type: StationType;
};

export enum CityType {
  Largecity = 'LARGECITY',
  Mediumcity = 'MEDIUMCITY',
  Megacity = 'MEGACITY',
  Smallcity = 'SMALLCITY',
  Town = 'TOWN',
  Village = 'VILLAGE'
}

export type CompanyIdOutput = {
  __typename?: 'CompanyIdOutput';
  company: Scalars['String'];
  companyId: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: UserOutput;
};


export type MutationCreateUserArgs = {
  userInput: UserInput;
};

export enum PointType {
  Airport = 'AIRPORT',
  City = 'CITY',
  Other = 'OTHER',
  Point = 'POINT',
  Port = 'PORT',
  Station = 'STATION'
}

export type Query = {
  __typename?: 'Query';
  findAirportById?: Maybe<AirportOutput>;
  findAllCitiesByAirportId?: Maybe<Array<Maybe<CityOutput>>>;
  findAllCitiesFromAssociatedTransit?: Maybe<Array<Maybe<CityOutput>>>;
  findAllRoutes: Array<Maybe<RouteSearchOutput>>;
  findCityById?: Maybe<CityOutput>;
  findStationById?: Maybe<StationOutput>;
  searchAirport?: Maybe<Array<Maybe<AirportOutput>>>;
  searchCity?: Maybe<Array<Maybe<CityOutput>>>;
  searchStation?: Maybe<Array<Maybe<StationOutput>>>;
};


export type QueryFindAirportByIdArgs = {
  airportId: Scalars['String'];
};


export type QueryFindAllCitiesByAirportIdArgs = {
  airportId: Scalars['String'];
};


export type QueryFindAllCitiesFromAssociatedTransitArgs = {
  transitSearchInput?: InputMaybe<TransitSearchInput>;
};


export type QueryFindAllRoutesArgs = {
  searchInput: RouteSearchInput;
};


export type QueryFindCityByIdArgs = {
  cityId: Scalars['String'];
};


export type QueryFindStationByIdArgs = {
  stationId: Scalars['String'];
};


export type QuerySearchAirportArgs = {
  query: Scalars['String'];
};


export type QuerySearchCityArgs = {
  query: Scalars['String'];
};


export type QuerySearchStationArgs = {
  query: Scalars['String'];
};

export type RouteOutput = {
  __typename?: 'RouteOutput';
  durationHours?: Maybe<Scalars['Int']>;
  durationMinutes?: Maybe<Scalars['Int']>;
  durationTotal?: Maybe<Scalars['Int']>;
  from: RouteStopOutput;
  lineDistance?: Maybe<Scalars['Float']>;
  to: RouteStopOutput;
  type: RouteType;
};

export type RouteSearchInput = {
  id: Scalars['String'];
  type: PointType;
};

export type RouteSearchOutput = {
  __typename?: 'RouteSearchOutput';
  destinationId: Scalars['String'];
  destinationName: Scalars['String'];
  durationAverage?: Maybe<Scalars['Int']>;
  latitude?: Maybe<Scalars['String']>;
  lineDistanceAverage?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['String']>;
  routes: Array<RouteOutput>;
};

export type RouteStopOutput = {
  __typename?: 'RouteStopOutput';
  country?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['String']>;
  longitude?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export enum RouteType {
  Boat = 'BOAT',
  Bus = 'BUS',
  Car = 'CAR',
  Other = 'OTHER',
  Plane = 'PLANE',
  Train = 'TRAIN'
}

export type StationOutput = {
  __typename?: 'StationOutput';
  airport: Scalars['Boolean'];
  apiId?: Maybe<Scalars['String']>;
  companyIds?: Maybe<Array<Maybe<CompanyIdOutput>>>;
  country?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  latitude: Scalars['String'];
  longitude: Scalars['String'];
  main: Scalars['Boolean'];
  name: Scalars['String'];
  parentId?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
  type: StationType;
  uicId?: Maybe<Scalars['String']>;
};

export type StationSearchOutput = {
  __typename?: 'StationSearchOutput';
  country?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<StationType>;
};

export enum StationType {
  Airport = 'AIRPORT',
  Bus = 'BUS',
  Ferry = 'FERRY',
  Other = 'OTHER',
  Train = 'TRAIN'
}

export type TransitSearchInput = {
  id: Scalars['String'];
  name: Scalars['String'];
  transitType?: InputMaybe<StationType>;
};

export type UserInput = {
  email: Scalars['String'];
  name: Scalars['String'];
};

export type UserOutput = {
  __typename?: 'UserOutput';
  email: Scalars['String'];
  name: Scalars['String'];
};

export type SearchCityQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type SearchCityQuery = { __typename?: 'Query', searchCity?: Array<{ __typename?: 'CityOutput', id: string, name: string, type: CityType, population: number, country: string, latitude: string, longitude: string } | null> | null };

export type FindAllRoutesQueryVariables = Exact<{
  id: Scalars['String'];
  type: PointType;
}>;


export type FindAllRoutesQuery = { __typename?: 'Query', findAllRoutes: Array<{ __typename?: 'RouteSearchOutput', destinationName: string, destinationId: string, latitude?: string | null, longitude?: string | null, durationAverage?: number | null, lineDistanceAverage?: number | null, routes: Array<{ __typename?: 'RouteOutput', type: RouteType, durationTotal?: number | null, durationMinutes?: number | null, durationHours?: number | null, lineDistance?: number | null, to: { __typename?: 'RouteStopOutput', name?: string | null, latitude?: string | null, longitude?: string | null, id?: string | null, country?: string | null }, from: { __typename?: 'RouteStopOutput', name?: string | null, latitude?: string | null, longitude?: string | null, id?: string | null, country?: string | null } }> } | null> };

export type FindCityByIdQueryVariables = Exact<{
  cityId: Scalars['String'];
}>;


export type FindCityByIdQuery = { __typename?: 'Query', findCityById?: { __typename?: 'CityOutput', name: string, type: CityType, latitude: string, longitude: string } | null };

export type FindAllCitiesFromAssociatedTransitQueryVariables = Exact<{
  id: Scalars['String'];
  transitType: StationType;
  name: Scalars['String'];
}>;


export type FindAllCitiesFromAssociatedTransitQuery = { __typename?: 'Query', findAllCitiesFromAssociatedTransit?: Array<{ __typename?: 'CityOutput', id: string, name: string, type: CityType, latitude: string, longitude: string } | null> | null };


export const SearchCityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchCity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchCity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"population"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}}]}}]} as unknown as DocumentNode<SearchCityQuery, SearchCityQueryVariables>;
export const FindAllRoutesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindAllRoutes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PointType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findAllRoutes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchInput"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"destinationName"}},{"kind":"Field","name":{"kind":"Name","value":"destinationId"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"routes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"to"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"from"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"durationTotal"}},{"kind":"Field","name":{"kind":"Name","value":"durationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"durationHours"}},{"kind":"Field","name":{"kind":"Name","value":"lineDistance"}}]}},{"kind":"Field","name":{"kind":"Name","value":"durationAverage"}},{"kind":"Field","name":{"kind":"Name","value":"lineDistanceAverage"}}]}}]}}]} as unknown as DocumentNode<FindAllRoutesQuery, FindAllRoutesQueryVariables>;
export const FindCityByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindCityById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findCityById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cityId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cityId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}}]}}]} as unknown as DocumentNode<FindCityByIdQuery, FindCityByIdQueryVariables>;
export const FindAllCitiesFromAssociatedTransitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindAllCitiesFromAssociatedTransit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"transitType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StationType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findAllCitiesFromAssociatedTransit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"transitSearchInput"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"transitType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"transitType"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}}]}}]} as unknown as DocumentNode<FindAllCitiesFromAssociatedTransitQuery, FindAllCitiesFromAssociatedTransitQueryVariables>;
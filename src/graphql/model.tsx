import { gql } from '@apollo/client';
export type Maybe<T> = T extends PromiseLike<infer U> ? Promise<U | null> : T | null;
export type InputMaybe<T> = T extends PromiseLike<infer U> ? Promise<U | null> : T | null;
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
  airports?: Maybe<Array<Maybe<CityAirportOutput>>>;
  country: Scalars['String'];
  id: Scalars['String'];
  latitude: Scalars['String'];
  longitude: Scalars['String'];
  name: Scalars['String'];
  population?: Maybe<Scalars['Int']>;
  trainStations?: Maybe<Array<Maybe<CityStationOutput>>>;
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
  airport: Scalars['Boolean'];
  latitude: Scalars['String'];
  longitude: Scalars['String'];
  main: Scalars['Boolean'];
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

export type Query = {
  __typename?: 'Query';
  findAirportById?: Maybe<AirportOutput>;
  findAllCitiesByAirportId?: Maybe<Array<Maybe<CityOutput>>>;
  findAllRoutesFromCity: Array<Maybe<RouteSearchOutput>>;
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


export type QueryFindAllRoutesFromCityArgs = {
  cityId: Scalars['String'];
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
  Bus = 'BUS',
  Ferry = 'FERRY',
  Other = 'OTHER',
  Train = 'TRAIN'
}

export type UserInput = {
  email: Scalars['String'];
  name: Scalars['String'];
};

export type UserOutput = {
  __typename?: 'UserOutput';
  email: Scalars['String'];
  name: Scalars['String'];
};

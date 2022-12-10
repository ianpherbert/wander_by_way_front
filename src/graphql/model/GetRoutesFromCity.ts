/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RouteType } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetRoutesFromCity
// ====================================================

export interface GetRoutesFromCity_findAllRoutesFromCity_routes_to {
  __typename: "RouteStopOutput";
  name: string | null;
  latitude: string | null;
  longitude: string | null;
  id: string | null;
  country: string | null;
}

export interface GetRoutesFromCity_findAllRoutesFromCity_routes_from {
  __typename: "RouteStopOutput";
  name: string | null;
  latitude: string | null;
  longitude: string | null;
  id: string | null;
  country: string | null;
}

export interface GetRoutesFromCity_findAllRoutesFromCity_routes {
  __typename: "RouteOutput";
  to: GetRoutesFromCity_findAllRoutesFromCity_routes_to;
  from: GetRoutesFromCity_findAllRoutesFromCity_routes_from;
  type: RouteType;
  durationTotal: number | null;
  durationMinutes: number | null;
  durationHours: number | null;
  lineDistance: number | null;
}

export interface GetRoutesFromCity_findAllRoutesFromCity {
  __typename: "RouteSearchOutput";
  destinationName: string;
  destinationId: string;
  latitude: string | null;
  longitude: string | null;
  routes: GetRoutesFromCity_findAllRoutesFromCity_routes[];
  durationAverage: number | null;
  lineDistanceAverage: number | null;
}

export interface GetRoutesFromCity {
  findAllRoutesFromCity: (GetRoutesFromCity_findAllRoutesFromCity | null)[];
}

export interface GetRoutesFromCityVariables {
  cityId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CityType } from "./globalTypes";

// ====================================================
// GraphQL query operation: SearchCity
// ====================================================

export interface SearchCity_searchCity {
  __typename: "CityOutput";
  id: string;
  name: string;
  type: CityType;
  population: number | null;
  country: string;
  latitude: string;
  longitude: string;
}

export interface SearchCity {
  searchCity: (SearchCity_searchCity | null)[] | null;
}

export interface SearchCityVariables {
  query: string;
}

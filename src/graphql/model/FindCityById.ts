/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CityType } from "./globalTypes";

// ====================================================
// GraphQL query operation: FindCityById
// ====================================================

export interface FindCityById_findCityById {
  __typename: "CityOutput";
  name: string;
  type: CityType;
  latitude: string;
  longitude: string;
}

export interface FindCityById {
  findCityById: FindCityById_findCityById | null;
}

export interface FindCityByIdVariables {
  cityId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { StationType, CityType } from "./globalTypes";

// ====================================================
// GraphQL query operation: FindAllCitiesFromAssociatedTransit
// ====================================================

export interface FindAllCitiesFromAssociatedTransit_findAllCitiesFromAssociatedTransit {
  __typename: "CityOutput";
  name: string;
  type: CityType;
  latitude: string;
  longitude: string;
}

export interface FindAllCitiesFromAssociatedTransit {
  findAllCitiesFromAssociatedTransit: (FindAllCitiesFromAssociatedTransit_findAllCitiesFromAssociatedTransit | null)[] | null;
}

export interface FindAllCitiesFromAssociatedTransitVariables {
  id: string;
  transitType: StationType;
  name: string;
}

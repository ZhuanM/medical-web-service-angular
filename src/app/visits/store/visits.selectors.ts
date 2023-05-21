import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "src/app/shared/models/app-state.interface";
import { State } from "./visits.reducer";

const visitsSelector = createFeatureSelector<AppState, State>('visits');

export const doctorVisits = createSelector(
  visitsSelector,
  (state: State) => state.doctorVisits
);

export const patientVisits = createSelector(
  visitsSelector,
  (state: State) => state.patientVisits
);


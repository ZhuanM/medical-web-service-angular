import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "src/app/shared/models/app-state.interface";
import { State } from "./profile.reducer";

const profileSelector = createFeatureSelector<AppState, State>('profile');

export const healthTaxDate = createSelector(
  profileSelector,
  (state: State) => state.healthTaxDate
);

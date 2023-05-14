import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "src/app/shared/models/app-state.interface";
import { State } from "./loader.reducer";

const loaderSelector = createFeatureSelector<AppState, State>('loader');

export const loading = createSelector(
  loaderSelector,
  (state: State) => state.loading
)
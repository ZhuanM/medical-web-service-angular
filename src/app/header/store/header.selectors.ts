import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "src/app/shared/models/app-state.interface";
import { State } from "./header.reducer";

const headerSelector = createFeatureSelector<AppState, State>('header');

export const sidenavOpened = createSelector(
  headerSelector,
  (state: State) => state.sidenavOpened
)

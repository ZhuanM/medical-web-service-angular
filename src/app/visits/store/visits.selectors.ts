import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "src/app/shared/models/app-state.interface";
import { State } from "./visits.reducer";

const visitsSelector = createFeatureSelector<AppState, State>('visits');


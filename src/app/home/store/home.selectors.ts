import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "src/app/shared/models/app-state.interface";
import { State } from "./home.reducer";

const homeSelector = createFeatureSelector<AppState, State>('home');


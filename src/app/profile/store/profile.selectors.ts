import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "src/app/shared/models/app-state.interface";
import { State } from "./profile.reducer";

const profileSelector = createFeatureSelector<AppState, State>('profile');

export const healthTaxDate = createSelector(
  profileSelector,
  (state: State) => state.healthTaxDate
);

export const patient = createSelector(
  profileSelector,
  (state: State) => state.patient
);

export const doctor = createSelector(
  profileSelector,
  (state: State) => state.doctor
);

export const doctorVisits = createSelector(
  profileSelector,
  (state: State) => state.doctorVisits
);

export const doctorPatients = createSelector(
  profileSelector,
  (state: State) => state.doctorPatients
);

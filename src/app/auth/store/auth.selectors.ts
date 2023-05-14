import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app-state.interface';
import { State } from './auth.reducer'

const authFeatureSelector = createFeatureSelector<AppState, State>('auth');

export const authError = createSelector(
  authFeatureSelector,
  (state: State) => state.authError
);

export const isLoading = createSelector(
  authFeatureSelector,
  (state: State) => state.isLoading
);

export const user = createSelector(
  authFeatureSelector,
  (state: State) => state.user
);

export const specializations = createSelector(
  authFeatureSelector,
  (state: State) => state.specializations
);

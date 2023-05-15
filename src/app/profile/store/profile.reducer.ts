import { createReducer, on, Action } from '@ngrx/store';
import * as ProfileActions from './profile.actions';

export interface State {
  healthTaxDate: string,
}

export const initialState: State = {
  healthTaxDate: null,
}

const _profileReducer = createReducer(
  initialState,

  on(
    ProfileActions.updateHealthTaxDateSuccess,
    (state, action) => ({
      ...state,
      healthTaxDate: action.healthTaxDate,
    })
  ),
);

export function profileReducer(state: State, action: Action) {
  return _profileReducer(state, action);
}

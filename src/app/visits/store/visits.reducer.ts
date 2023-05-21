import { createReducer, on, Action } from '@ngrx/store';
import * as VisitsActions from './visits.actions';

export interface State {
  doctorVisits: any,
  patientVisits: any
}

export const initialState: State = {
  doctorVisits: null,
  patientVisits: null
}

const _visitsReducer = createReducer(
  initialState,

  on(
    VisitsActions.getPatientVisitsSuccess,
    (state, action) => ({
      ...state,
      patientVisits: action.patientVisits,
    })
  ),

  on(
    VisitsActions.getDoctorVisitsSuccess,
    (state, action) => ({
      ...state,
      doctorVisits: action.doctorVisits,
    })
  ),
);

export function visitsReducer(state: State, action: Action) {
  return _visitsReducer(state, action);
}

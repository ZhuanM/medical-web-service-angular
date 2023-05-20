import { createReducer, on, Action } from '@ngrx/store';
import * as ProfileActions from './profile.actions';

export interface State {
  healthTaxDate: string,
  patient: any,
  doctor: any,
  doctorVisits: any,
  doctorPatients: any,
}

export const initialState: State = {
  healthTaxDate: null,
  patient: null,
  doctor: null,
  doctorVisits: null,
  doctorPatients: null,
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

  on(
    ProfileActions.getPatientByIdSuccess,
    (state, action) => ({
      ...state,
      patient: action.patient,
    })
  ),

  on(
    ProfileActions.getDoctorByIdSuccess,
    (state, action) => ({
      ...state,
      doctor: action.doctor,
    })
  ),

  on(
    ProfileActions.getDoctorAssignedPatientsSuccess,
    (state, action) => ({
      ...state,
      doctorPatients: action.doctorPatients
    })
  ),

  on(
    ProfileActions.getDoctorVisitsSuccess,
    (state, action) => ({
      ...state,
      doctorVisits: action.doctorVisits,
    })
  ),
);

export function profileReducer(state: State, action: Action) {
  return _profileReducer(state, action);
}

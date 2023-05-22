import { createAction, props } from "@ngrx/store";

export const getPatientVisits = createAction(
  '[Visits Component] Get Patient Visits',
  props<{
    id: string,
  }>()
);

export const getPatientVisitsSuccess = createAction(
  '[Visits Component] Get Patient Visits Success',
  props<{
    patientVisits: any
  }>()
);

export const getDoctorVisits = createAction(
  '[Visits Component] Get Doctor Visits',
  props<{
    id: string,
  }>()
);

export const getDoctorVisitsSuccess = createAction(
  '[Visits Component] Get Doctor Visits Success',
  props<{
    doctorVisits: any
  }>()
);

export const updateVisit = createAction(
  '[Visits Component] Update Visit',
  props<{
    id: string,
    params: any
  }>()
);

export const updateVisitSuccess = createAction(
  '[Visits Component] Update Visit Success'
);

export const createVisit = createAction(
  '[Visits Component] Create Visit',
  props<{
    date: string,
    doctor: {name: string, userId: string},
    patient: {name: string, userId: string}
  }>()
);

export const createVisitSuccess = createAction(
  '[Visits Component] Create Visit Success'
);


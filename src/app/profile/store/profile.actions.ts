import { createAction, props } from "@ngrx/store";
import { Specialization } from "src/app/shared/models/specialization.enum";

export const updateHealthTaxDate = createAction(
  '[Profile Component] Update Health Tax Date',
  props<{
    id: string,
    date: string
  }>()
);

export const updateHealthTaxDateSuccess = createAction(
  '[Profile Component] Update Health Tax Date Success',
  props<{
    healthTaxDate: string,
  }>()
);

export const getPatientById = createAction(
  '[Profile Component] Get Patient By Id',
  props<{
    id: string,
  }>()
);

export const getPatientByIdSuccess = createAction(
  '[Profile Component] Get Patient By Id Success',
  props<{
    patient: any
  }>()
);

export const getDoctorById = createAction(
  '[Profile Component] Get Doctor By Id',
  props<{
    id: string,
  }>()
);

export const getDoctorByIdSuccess = createAction(
  '[Profile Component] Get Doctor By Id Success',
  props<{
    doctor: any
  }>()
);

export const getDoctorVisits = createAction(
  '[Profile Component] Get Doctor Visits',
  props<{
    id: string,
  }>()
);

export const getDoctorVisitsSuccess = createAction(
  '[Profile Component] Get Doctor Visits Success',
  props<{
    doctorVisits: any
  }>()
);

export const getDoctorAssignedPatients = createAction(
  '[Profile Component] Get Doctor Assigned Patients',
  props<{
    id: string,
  }>()
);

export const getDoctorAssignedPatientsSuccess = createAction(
  '[Profile Component] Get Doctor Assigned Patients Success',
  props<{
    doctorPatients: any
  }>()
);

export const updateDoctorSpecializations = createAction(
  '[Profile Component] Update Doctor Specializations',
  props<{
    id: string,
    specializations: Array<Specialization>
  }>()
);

export const updateDoctorSpecializationsSuccess = createAction(
  '[Profile Component] Update Doctor Specializations Success'
);

import { createAction, props } from '@ngrx/store';
import { Doctor } from 'src/app/shared/models/doctor.interface';
import { Specialization } from 'src/app/shared/models/specialization.enum';
import { User } from 'src/app/shared/models/user.interface';

export const login = createAction(
  '[Auth Component] Login',
  props<{
    username: string,
    password: string
  }>()
);

export const registerPatient = createAction(
  '[Auth Component] Register Patient',
  props<{
    name: string,
    username: string,
    password: string,
    uniqueCitizenNumber: string,
    gp: {
      userId: string
    }
  }>()
);

export const registerDoctor = createAction(
  '[Auth Component] Register Doctor',
  props<{
    name: string,
    username: string,
    password: string,
    uniqueDoctorNumber: string,
    specialization: string,
  }>()
);

export const authSuccess = createAction(
  '[Auth Component] Auth Success',
  props<{
    accessToken: string,
    id: number,
    role: string
  }>()
);

export const authFail = createAction(
  '[Auth Component] Auth Fail',
  props<{
    errorMessage: string
  }>()
);

export const getUser = createAction(
  '[Auth Component] Get User',
  props<{
    id: number
  }>()
);

export const getUserSuccess = createAction(
  '[Auth Component] Get User Success',
  props<{
    user: User
  }>()
);

export const getSpecializations = createAction(
  '[Auth Component] Get Specializations'
);

export const getSpecializationsSuccess = createAction(
  '[Auth Component] Get Specializations Success',
  props<{
    specializations: Array<Specialization>
  }>()
);

export const getDoctors = createAction(
  '[Auth Component] Get Doctors'
);

export const getDoctorsSuccess = createAction(
  '[Auth Component] Get Doctors Success',
  props<{
    doctors: Array<Doctor>
  }>()
);

export const logout = createAction(
  '[Auth Component] Logout'
);

export const logoutSuccess = createAction(
  '[Auth Component] Logout Success'
);

export const resetErrorState = createAction(
  '[Auth Component] Reset Error State'
);

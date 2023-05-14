import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/shared/models/user.interface';

export const login = createAction(
  '[Auth Component] Login',
  props<{
    username: string,
    password: string
  }>()
);

export const register = createAction(
  '[Auth Component] Register',
  props<{
    name: string,
    username: string,
    password: string,
    role: string,
    uniqueUserNumber: string,
    specialization: string,
    gp: {
      userId: string
    }
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
    specializations: Array<string>
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

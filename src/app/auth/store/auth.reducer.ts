import { createReducer, on, Action } from '@ngrx/store';
import { User } from '../../shared/models/user.interface';
import * as AuthActions from './auth.actions';
import { Doctor } from 'src/app/shared/models/doctor.interface';
import { Specialization } from 'src/app/shared/models/specialization.enum';

export interface State {
  accessToken: string;
  authError: string;
  isLoading: boolean;
  user: User;
  id: number;
  specializations: Array<Specialization>;
  doctors: Array<Doctor>;
}

export const initialState: State = {
  accessToken: null,
  authError: null,
  isLoading: false,
  user: null,
  id: null,
  specializations: null,
  doctors: null,
}

const _authReducer = createReducer(

  initialState,

  on(
    AuthActions.login,
    (state) => ({
      ...state,
      authError: null,
      isLoading: true
    })
  ),

  on(
    AuthActions.authSuccess,
    (state, action) => ({
      ...state,
      authError: null,
      isLoading: false,
      accessToken: action.accessToken,
      id: action.id
    })
  ),

  on(
    AuthActions.authFail,
    (state, action) => ({
      ...state,
      accessToken: null,
      authError: action.errorMessage,
      isLoading: false,
      user: null,
      id: null
    })
  ),

  on(
    AuthActions.logoutSuccess,
    (state) => ({
      ...state,
      accessToken: null,
      authError: null,
      isLoading: false,
      user: null,
      id: null
    })
  ),

  on(
    AuthActions.getUserSuccess,
    (state, action) => ({
      ...state,
      isLoading: false,
      user: action.user,
    })
  ),

  on(
    AuthActions.getSpecializationsSuccess,
    (state, action) => ({
      ...state,
      specializations: action.specializations,
    })
  ),

  on(
    AuthActions.getDoctorsSuccess,
    (state, action) => ({
      ...state,
      doctors: action.doctors,
    })
  ),
);

export function authReducer(state: State, action: Action) {
  return _authReducer(state, action);
}

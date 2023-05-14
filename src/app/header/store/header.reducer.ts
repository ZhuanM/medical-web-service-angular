import { createReducer, on, Action } from '@ngrx/store';
import * as HeaderActions from './header.actions';

export interface State {
  error: string;
  sidenavOpened: boolean;
}

export const initialState: State = {
  error: null,
  sidenavOpened: false,
}

const _headerReducer = createReducer(

  initialState,
  
  on(
    HeaderActions.showSidenav,
    (state) => ({
      ...state,
      sidenavOpened: true
    })
  ),

  on(
    HeaderActions.hideSidenav,
    (state) => ({
      ...state,
      sidenavOpened: false
    })
  ),
);

export function headerReducer(state: State, action: Action) {
  return _headerReducer(state, action);
}

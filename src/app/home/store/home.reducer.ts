import { createReducer, on, Action } from '@ngrx/store';

export interface State {
}

export const initialState: State = {
}

const _homeReducer = createReducer(
  initialState,

);

export function homeReducer(state: State, action: Action) {
  return _homeReducer(state, action);
}

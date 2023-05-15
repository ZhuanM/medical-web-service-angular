import { createReducer, on, Action } from '@ngrx/store';

export interface State {
}

export const initialState: State = {
}

const _profileReducer = createReducer(
  initialState,

);

export function profileReducer(state: State, action: Action) {
  return _profileReducer(state, action);
}

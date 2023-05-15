import { createReducer, on, Action } from '@ngrx/store';

export interface State {
}

export const initialState: State = {
}

const _visitsReducer = createReducer(
  initialState,

);

export function visitsReducer(state: State, action: Action) {
  return _visitsReducer(state, action);
}

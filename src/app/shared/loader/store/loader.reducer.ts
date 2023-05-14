import { createReducer, on, Action } from '@ngrx/store';
import { appLoading } from './loader.actions';

export interface State {
  loading: boolean
}

export const initialState: State = {
  loading: null
}

const _loaderReducer = createReducer(
  initialState,
  on(appLoading, (state, action) => {
    return {
        ...state,
        loading: action.loading
    }
}),
);

export function loaderReducer(state: State, action: Action) {
  return _loaderReducer(state, action);
}

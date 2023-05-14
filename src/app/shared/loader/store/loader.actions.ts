import { createAction, props } from '@ngrx/store';

export const appLoading = createAction(
  '[App Component] App Loading',
  props<{
    loading: boolean;
  }>()
);

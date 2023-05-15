import { createAction, props } from "@ngrx/store";

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

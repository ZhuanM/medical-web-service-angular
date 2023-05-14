import { createAction } from '@ngrx/store';

export const showSidenav = createAction(
  '[Header Component] Show Sidenav'
);

export const hideSidenav = createAction(
  '[Header Component] Hide Sidenav'
);

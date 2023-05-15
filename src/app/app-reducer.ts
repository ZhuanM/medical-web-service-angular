import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './shared/models/app-state.interface';
import * as fromAuth from './auth/store/auth.reducer';
import * as fromHeader from './header/store/header.reducer';
import * as fromLoader from './shared/loader/store/loader.reducer';
import * as fromHome from './home/store/home.reducer';
import * as fromProfile from './profile/store/profile.reducer';
import * as fromVisits from './visits/store/visits.reducer';

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  header: fromHeader.headerReducer,
  loader: fromLoader.loaderReducer,
  home: fromHome.homeReducer,
  profile: fromProfile.profileReducer,
  visits: fromVisits.visitsReducer,
};

import * as fromAuth from '../../auth/store/auth.reducer';
import * as fromLoader from '../../shared/loader/store/loader.reducer';
import * as fromHeader from '../../header/store/header.reducer';
import * as fromHome from '../../home/store/home.reducer';
import * as fromProfile from '../../profile/store/profile.reducer';
import * as fromVisits from '../../visits/store/visits.reducer';

export interface AppState {
  auth: fromAuth.State,
  loader: fromLoader.State
  header: fromHeader.State,
  home: fromHome.State,
  profile: fromProfile.State,
  visits: fromVisits.State,
};
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppService } from '../../app.service';
import * as ProfileActions from './profile.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageType } from 'src/app/shared/models/message-type.enum';
import { ProfileService } from '../profile.service';
import { setUserLocalStorageData } from 'src/app/shared/utility';

@Injectable()
export class ProfileEffects {
  constructor(
    private actions$: Actions,
    private profileService: ProfileService,
    private appService: AppService,
  ) {}

  updateHealthTaxDate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.updateHealthTaxDate),
      switchMap((action) => {
        return this.profileService.updateHealthTaxDate(action.id, action.date).pipe(
          map((response) => {
            localStorage.setItem('healthTaxesPaidUntil', response.healthTaxesPaidUntil);
            this.appService.openSnackBar('Health taxes successfully paid!', MessageType.Success);
            return ProfileActions.updateHealthTaxDateSuccess({
              healthTaxDate: response.healthTaxesPaidUntil
            });
          })
        );
      })
    )
  );

  getPatientById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.getPatientById),
      switchMap((action) => {
        return this.profileService.getPatientById(action.id).pipe(
          map((response) => {
            setUserLocalStorageData(response);
            return ProfileActions.getPatientByIdSuccess({
              patient: response
            });
          })
        );
      })
    )
  );

  getDoctorById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.getDoctorById),
      switchMap((action) => {
        return this.profileService.getDoctorById(action.id).pipe(
          map((response) => {
            setUserLocalStorageData(response);
            return ProfileActions.getDoctorByIdSuccess({
              doctor: response
            });
          })
        );
      })
    )
  );

  getDoctorVisits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.getDoctorVisits),
      switchMap((action) => {
        return this.profileService.getDoctorVisits(action.id).pipe(
          map((response) => {
            setUserLocalStorageData(response);
            return ProfileActions.getDoctorVisitsSuccess({
              doctorVisits: response
            });
          })
        );
      })
    )
  );

  getDoctorAssignedPatients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.getDoctorAssignedPatients),
      switchMap((action) => {
        return this.profileService.getDoctorPatients(action.id).pipe(
          map((response) => {
            setUserLocalStorageData(response);
            return ProfileActions.getDoctorAssignedPatientsSuccess({
              doctorPatients: response
            });
          })
        );
      })
    )
  );

  updateDoctorSpecializations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.updateDoctorSpecializations),
      switchMap((action) => {
        return this.profileService.updateDoctorSpecializations(action.id, action.specializations).pipe(
          map((response) => {
            this.appService.openSnackBar('Successfully updated specializations!', MessageType.Success);
            localStorage.setItem('specializations', JSON.stringify(action.specializations));
            return ProfileActions.updateDoctorSpecializationsSuccess();
          })
        );
      })
    )
  );
}

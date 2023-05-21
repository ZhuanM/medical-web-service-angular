import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppService } from '../../app.service';
import * as VisitsActions from './visits.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageType } from 'src/app/shared/models/message-type.enum';
import { VisitsService } from '../visits.service';

@Injectable()
export class VisitsEffects {
  

  constructor(
    private actions$: Actions,
    private visitsService: VisitsService,
    private appService: AppService,
  ){}

  getPatientVisits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VisitsActions.getPatientVisits),
      switchMap((action) => {
        return this.visitsService.getPatientVisits(action.id).pipe(
          map((response) => {
            return VisitsActions.getPatientVisitsSuccess({
              patientVisits: response
            });
          })
        );
      })
    )
  );

  getDoctorVisits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VisitsActions.getDoctorVisits),
      switchMap((action) => {
        return this.visitsService.getDoctorVisits(action.id).pipe(
          map((response) => {
            return VisitsActions.getDoctorVisitsSuccess({
              doctorVisits: response
            });
          })
        );
      })
    )
  );

  updateVisit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VisitsActions.updateVisit),
      switchMap((action) => {
        return this.visitsService.updateVisit(action.id, action.params).pipe(
          map((response) => {
            return VisitsActions.updateVisitSuccess();
          })
        );
      })
    )
  );
}

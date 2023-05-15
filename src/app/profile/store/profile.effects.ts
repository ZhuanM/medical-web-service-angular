import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppService } from '../../app.service';
import * as ProfileActions from './profile.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageType } from 'src/app/shared/models/message-type.enum';
import { ProfileService } from '../profile.service';

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
            return ProfileActions.updateHealthTaxDateSuccess({
              healthTaxDate: response.healthTaxesPaidUntil
            });
          })
        );
      })
    )
  );
}

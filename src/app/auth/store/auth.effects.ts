import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from './../auth.service';
import { AppService } from '../../app.service';
import * as AuthActions from './auth.actions';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageType } from 'src/app/shared/models/message-type.enum';
import { Auth } from 'src/app/shared/models/auth.interface';
import { setUserLocalStorageData } from 'src/app/shared/utility';

@Injectable()
export class AuthEffects {
  authLogin$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.login),
    switchMap(action => {
      return this.authService.login(action.username, action.password)
        .pipe(
          tap(() => this.router.navigate(['/home'])),
          map(response => {
            this.setInitialLocalStorageData(response);

            return AuthActions.authSuccess(
              {
                accessToken: response.jwtToken,
                id: response.userId,
                role: response.role
              }
            )
          }),
          catchError((errorRes: HttpErrorResponse) => {
            return of(AuthActions.authFail(
              { errorMessage: 'Invalid username and/or password' }
            ));
          })
        );
      })
    )
  );

  authSuccess$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.authSuccess),
    switchMap(action => {
      return this.authService.getUser(action.role, action.id)
        .pipe(
          map(response => {
            setUserLocalStorageData(response);

            this.appService.openSnackBar("Successfully logged in!", MessageType.Success);

            return AuthActions.getUserSuccess(
              {
                user: response
              }
            )
          })
        );
      })
    )
  );

  logout$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.logout),
      tap(() => this.router.navigate(['/home'])),
      map(() => {
        localStorage.clear();

        return AuthActions.logoutSuccess();
      }),
    )
  );

  authRegisterPatient$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.registerPatient),
    switchMap(action => {
      const username = action.username;
      const password = action.password;
      
      return this.authService.registerPatient(
        action.name,
        action.username,
        action.password,
        action.uniqueCitizenNumber,
        action.gp)
        .pipe(
          map(authData => {
            return AuthActions.login({username: username, password: password})
          }),
          catchError((errorRes: HttpErrorResponse) => {
            return of(AuthActions.authFail(
              { errorMessage: 'Invalid email and/or password' }
            ));
          })
        );
      })
    )
  );

  authRegisterDoctor$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.registerDoctor),
    switchMap(action => {
      const username = action.username;
      const password = action.password;
      
      return this.authService.registerDoctor(
        action.name,
        action.username,
        action.password,
        action.uniqueDoctorNumber,
        action.specialization)
        .pipe(
          map(authData => {
            return AuthActions.login({username: username, password: password})
          }),
          catchError((errorRes: HttpErrorResponse) => {
            return of(AuthActions.authFail(
              { errorMessage: 'Invalid email and/or password' }
            ));
          })
        );
      })
    )
  );

  getSpecializations$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.getSpecializations),
    switchMap(action => {
      return this.authService.getSpecializations()
        .pipe(
          map(data => {
            return AuthActions.getSpecializationsSuccess({specializations: data})
          })
        );
      })
    )
  );

  getDoctors$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.getDoctors),
    switchMap(action => {
      return this.authService.getDoctors()
        .pipe(
          map(data => {
            return AuthActions.getDoctorsSuccess({doctors: data})
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private appService: AppService,
    private router: Router
  ){}

  private setInitialLocalStorageData(authData: Auth) {
    localStorage.setItem('access_token', authData.jwtToken);
    localStorage.setItem('role', authData.role);
    localStorage.setItem('userId', authData.userId);
  }
}

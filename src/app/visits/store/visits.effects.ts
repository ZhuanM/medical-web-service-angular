import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppService } from '../../app.service';
import * as VisitsActions from './visits.actions';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageType } from 'src/app/shared/models/message-type.enum';
import { VisitsService } from '../visits.service';

@Injectable()
export class VisitsEffects {
  

  constructor(
    private actions$: Actions,
    private visitsService: VisitsService,
    private appService: AppService,
    private router: Router
  ){}

  
}

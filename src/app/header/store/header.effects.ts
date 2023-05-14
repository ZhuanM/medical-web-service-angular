import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { HeaderService } from '../header.service';
import * as HeaderActions from './header.actions';
import { of } from 'rxjs';

@Injectable()
export class HeaderEffects {
  constructor(
    private actions$: Actions,
    private headerService: HeaderService
  ){}
}

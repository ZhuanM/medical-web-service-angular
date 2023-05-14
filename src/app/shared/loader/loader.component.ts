import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../base.component';
import * as LoaderSelectors from '../loader/store/loader.selectors';
import { AppState } from '../models/app-state.interface';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent extends BaseComponent {
  readonly loading$: Observable<boolean> = this.store.pipe(select(LoaderSelectors.loading), takeUntil(this.destroyed$));

  constructor(private store: Store<AppState>) { 
    super()
  }
}

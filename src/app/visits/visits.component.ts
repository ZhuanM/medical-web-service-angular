import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from '../shared/base.component';
import { AppState } from '../shared/models/app-state.interface';

@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.scss']
})
export class VisitsComponent extends BaseComponent {
  constructor(private store: Store<AppState>) {
    super();
  }
}

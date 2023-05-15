import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { BaseComponent } from '../shared/base.component';
import { AppState } from '../shared/models/app-state.interface';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { healthTaxDate } from './store/profile.selectors';
import { updateHealthTaxDate } from './store/profile.actions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends BaseComponent {
  readonly healthTaxDate$: Observable<string> = this.store.pipe(select(healthTaxDate), takeUntil(this.destroyed$));

  public role: string = localStorage.getItem("role");
  public name: string = localStorage.getItem("name");
  public healthTaxesPaidUntil: string = localStorage.getItem("healthTaxesPaidUntil");

  public minDate: Date;
  public selectedDate: Date;

  constructor(private store: Store<AppState>, private datePipe: DatePipe) {
    super();

    this.minDate = new Date(this.healthTaxesPaidUntil);

    this.healthTaxDate$.pipe(takeUntil(this.destroyed$)).subscribe(healthTaxDate => {
      if (healthTaxDate) {
        this.healthTaxesPaidUntil = localStorage.getItem("healthTaxesPaidUntil");
        this.minDate = new Date(this.healthTaxesPaidUntil);
      }
    });
  }

  public payHealthTaxes() {
    const userId = localStorage.getItem('userId');
    const dateToPatch = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
    this.store.dispatch(updateHealthTaxDate({ id: userId, date: dateToPatch }));
  }
}

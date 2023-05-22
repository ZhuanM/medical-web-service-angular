import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { BaseComponent } from '../../base.component';
import { AppState } from '../../models/app-state.interface';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MessageType } from '../../models/message-type.enum';
import { AppService } from 'src/app/app.service';
import { appLoading } from '../../loader/store/loader.actions';
import { getDoctors } from 'src/app/auth/store/auth.actions';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Doctor } from '../../models/doctor.interface';
import { doctors } from 'src/app/auth/store/auth.selectors';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-create-visit-modal',
  templateUrl: './create-visit-modal.component.html',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CreateVisitModalComponent extends BaseComponent {
  readonly doctors$: Observable<Array<Doctor>> = this.store.pipe(select(doctors), takeUntil(this.destroyed$));

  public createForm = this.fb.group({
    doctor: ['', Validators.required],
    visitDate: ['', Validators.required],
  });

  public doctorNames = [];

  public minDate: Date = new Date(); // Minimum date is today

  constructor(
    private store: Store<AppState>,
    public dialogRef: MatDialogRef<CreateVisitModalComponent>,
    private fb: FormBuilder,
    private appService: AppService,
  ) {
    super();

    this.store.dispatch(appLoading({ loading: true }));
    this.store.dispatch(getDoctors());

    this.doctors$.pipe(takeUntil(this.destroyed$)).subscribe(doctors => {
      if (doctors) {
        this.doctorNames = doctors;
      }
    });
  }

  public onCancel() {
    this.dialogRef.close();
  }

  public onCreate() {
    if (this.createForm.invalid) {
      this.appService.openSnackBar('Please fill in all required fields.', MessageType.Error);
      return;
    }

    // const doctor = {
    //   name: this.createForm.get('doctor').value.name,
    //   userId:  this.createForm.get('doctor').value.id
    // };

    console.log("doctor", this.createForm.get('doctor'));
    console.log("doctor value", this.createForm.get('doctor').value);
    const createdVisit = {
      doctor: this.createForm.get('doctor').value,
      visitDate: this.createForm.get('visitDate').value
    };

    this.dialogRef.close(createdVisit);
  }
}

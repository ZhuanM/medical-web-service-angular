import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from '../../base.component';
import { AppState } from '../../models/app-state.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormArray, FormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AppService } from 'src/app/app.service';
import { MessageType } from '../../models/message-type.enum';

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
  selector: 'app-edit-visit-modal',
  templateUrl: './edit-visit-modal.component.html',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class EditVisitModalComponent extends BaseComponent {
  public editForm: UntypedFormGroup;
  public minDate: Date;

  constructor(
    private store: Store<AppState>,
    public dialogRef: MatDialogRef<EditVisitModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private appService: AppService,
  ) {
    super();
  }

  ngOnInit() {
    if (this.data) {
      this.minDate = new Date();

      this.editForm = this.formBuilder.group(
        {
          diagnosis: [this.data?.diagnosis ?? '', Validators.required],
          treatment: this.formBuilder.array(this.createTreatmentControls()),
          sickLeaveFrom: [this.data?.sickLeave?.startDate ?? ''],
          sickLeaveTo: [this.data?.sickLeave?.endDate ?? ''],
        },
        {
          validators: [
            this.dateRangeValidator,
            this.sickLeaveValidator,
            this.treatmentValidator,
          ],
        }
      );
    }
  }

  get treatmentControls(): Array<AbstractControl> {
    return (this.editForm.get('treatment') as FormArray).controls;
  }

  get minSickLeaveToDate(): Date {
    const sickLeaveFrom = this.editForm.controls.sickLeaveFrom.value;
    return sickLeaveFrom ? new Date(sickLeaveFrom) : this.minDate;
  }

  private createTreatmentControls(): Array<UntypedFormGroup> {
    const controls: Array<UntypedFormGroup> = [];

    const medicaments = this.data?.medicaments ?? [];
    for (const medicament of medicaments) {
      const controlGroup = this.formBuilder.group({
        medicamentName: [medicament.medicamentName ?? ''],
        dosage: [medicament.dosage ?? ''],
      });

      controls.push(controlGroup);
    }

    return controls;
  }

  public addMedicament() {
    const controlGroup = this.formBuilder.group({
      medicamentName: [''],
      dosage: [''],
    });

    (this.editForm.get('treatment') as FormArray).push(controlGroup);
  }

  public removeMedicament(index: number) {
    const treatmentArray = this.editForm.get('treatment') as FormArray;
    treatmentArray.removeAt(index);
  }

  private dateRangeValidator: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } | null => {
    const sickLeaveFrom = control.get('sickLeaveFrom');
    const sickLeaveTo = control.get('sickLeaveTo');
  
    if (sickLeaveFrom && sickLeaveTo && sickLeaveFrom.value && sickLeaveTo.value) {
      const fromDate = new Date(sickLeaveFrom.value);
      const toDate = new Date(sickLeaveTo.value);
  
      if (fromDate > toDate) {
        return { dateRangeInvalid: true };
      }
  
      // This to prevents "Sick Leave To" to be before today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (toDate < today) {
        return { toDateBeforeToday: true };
      }
    }
  
    return null;
  };

  private sickLeaveValidator: ValidatorFn = (
    control: AbstractControl
  ): { [key: string]: boolean } | null => {
    const sickLeaveFrom = control.get('sickLeaveFrom');
    const sickLeaveTo = control.get('sickLeaveTo');

    if (
      sickLeaveFrom &&
      sickLeaveTo &&
      (sickLeaveFrom.value || sickLeaveTo.value)
    ) {
      if (!sickLeaveFrom.value || !sickLeaveTo.value) {
        return { sickLeaveInvalid: true };
      }
    }

    return null;
  };

  private treatmentValidator: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } | null => {
    const treatment = control.get('treatment') as FormArray;

    for (let i = 0; i < treatment.length; i++) {
      const medicamentName = treatment.at(i).get('medicamentName');
      const dosage = treatment.at(i).get('dosage');

      // Check if both fields are empty
      if (medicamentName && dosage && !medicamentName.value && !dosage.value) {
        return { emptyMedicament: true };
      }

      // Check if only one field is filled
      if (medicamentName && dosage && (medicamentName.value || dosage.value)) {
        if (!medicamentName.value || !dosage.value) {
          return { treatmentInvalid: true };
        }
      }
    }

    return null;
  };

  public onCancel() {
    this.dialogRef.close();
  }

  public onSave() {
    if (this.editForm.invalid) {
      this.appService.openSnackBar('Please fill in all required fields.', MessageType.Error);
      return;
    }

    const diagnosis: string = this.editForm.value.diagnosis;
    const treatment: any = this.treatmentControls.map(
      (control) => control.value
    );
    const sickLeaveFrom: Date = this.editForm.value.sickLeaveFrom;
    const sickLeaveTo: Date = this.editForm.value.sickLeaveTo;
    const numberOfDays: number = this.calculateSickLeaveDays(
      sickLeaveFrom,
      sickLeaveTo
    );

    const editedVisit = {
      diagnosis: diagnosis,
      treatment: treatment,
      sickLeaveFrom: sickLeaveFrom,
      sickLeaveTo: sickLeaveTo,
      numberOfDays: numberOfDays,
    };

    this.dialogRef.close(editedVisit);
  }

  private calculateSickLeaveDays(
    sickLeaveFrom: Date,
    sickLeaveTo: Date
  ): number {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const fromDate = new Date(sickLeaveFrom);
    const toDate = new Date(sickLeaveTo);

    // Set the hours, minutes, and seconds to the same value to only calculate the difference in days
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(0, 0, 0, 0);

    const differenceInMilliseconds = Math.abs(
      fromDate.getTime() - toDate.getTime()
    );
    const differenceInDays = Math.round(
      differenceInMilliseconds / millisecondsPerDay
    );

    return differenceInDays;
  }
}

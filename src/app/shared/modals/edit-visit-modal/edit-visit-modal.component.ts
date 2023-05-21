import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from '../../base.component';
import { AppState } from '../../models/app-state.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormArray, FormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

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
  styleUrls: ['./edit-visit-modal.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
})
export class EditVisitModalComponent extends BaseComponent {
  public editForm: UntypedFormGroup;
  public minSickLeaveDate: Date;

  constructor(private store: Store<AppState>,
    public dialogRef: MatDialogRef<EditVisitModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar)
  {
    super();

    this.editForm = this.formBuilder.group({
      diagnosis: [data?.diagnosis ?? '', Validators.required],
      treatment: this.formBuilder.array(this.createTreatmentControls()),
      sickLeaveFrom: [data?.sickLeave?.startDate ?? '', Validators.required],
      sickLeaveTo: [data?.sickLeave?.endDate ?? '', Validators.required]
    }, { validators: this.dateRangeValidator });

    this.minSickLeaveDate = new Date(); // Minimum date is today
  }

  get treatmentControls(): Array<AbstractControl> {
    return (this.editForm.get('treatment') as FormArray).controls;
  }

  private createTreatmentControls(): Array<UntypedFormGroup> {
    const controls: Array<UntypedFormGroup> = [];
  
    const medicaments = this.data?.medicaments ?? [];
    for (const medicament of medicaments) {
      const controlGroup = this.formBuilder.group({
        medicamentName: [medicament.medicamentName ?? '', Validators.required],
        dosage: [medicament.dosage ?? '', Validators.required],
      });

      controls.push(controlGroup);
    }
  
    return controls;
  }

  // public addMedicament() {
  //   const controlGroup = this.formBuilder.group({
  //     medicamentName: ['', Validators.required],
  //     dosage: ['', Validators.required]
  //   });

  //   this.treatmentControls.push(controlGroup);
  // }

  public addMedicament() {
    const controlGroup = this.formBuilder.group({
      medicamentName: ['', Validators.required],
      dosage: ['', Validators.required]
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

    if (sickLeaveFrom && sickLeaveTo) {
      const fromDate = new Date(sickLeaveFrom.value);
      const toDate = new Date(sickLeaveTo.value);

      if (fromDate > toDate) {
        return { dateRangeInvalid: true };
      }
    }

    return null;
  };

  public onCancelClick() {
    this.dialogRef.close();
  }

  public onSaveClick() {
    if (this.editForm.invalid) {
      this.snackBar.open('Please fill in all required fields.', 'Close', {
        duration: 3000
      });
      return;
    }
    
    const diagnosis: string = this.editForm.value.diagnosis;
    const treatment: any = this.treatmentControls.map(control => control.value);
    const sickLeaveFrom: Date = this.editForm.value.sickLeaveFrom;
    const sickLeaveTo: Date = this.editForm.value.sickLeaveTo;
    const numberOfDays: number = this.calculateSickLeaveDays(sickLeaveFrom, sickLeaveTo);

    const editedVisit = {
      diagnosis: diagnosis,
      treatment: treatment,
      sickLeaveFrom: sickLeaveFrom,
      sickLeaveTo: sickLeaveTo,
      numberOfDays: numberOfDays
    };
    
    this.dialogRef.close(editedVisit);
  }

  private calculateSickLeaveDays(sickLeaveFrom: Date, sickLeaveTo: Date): number {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const fromDate = new Date(sickLeaveFrom);
    const toDate = new Date(sickLeaveTo);
  
    // Set the hours, minutes, and seconds to the same value to only calculate the difference in days
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(0, 0, 0, 0);
  
    const differenceInMilliseconds = Math.abs(fromDate.getTime() - toDate.getTime());
    const differenceInDays = Math.round(differenceInMilliseconds / millisecondsPerDay);
  
    return differenceInDays;
  }
}

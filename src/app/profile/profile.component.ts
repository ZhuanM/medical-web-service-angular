import { Component } from '@angular/core';
import { ActionsSubject, Store, select } from '@ngrx/store';
import { BaseComponent } from '../shared/base.component';
import { AppState } from '../shared/models/app-state.interface';
import { DatePipe } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { doctor, doctorPatients, doctorVisits, healthTaxDate, patient } from './store/profile.selectors';
import { getDoctorAssignedPatients, getDoctorById, getDoctorVisits, getPatientById, updateDoctorSpecializations, updateHealthTaxDate } from './store/profile.actions';
import { appLoading } from '../shared/loader/store/loader.actions';
import { getSpecializations } from '../auth/store/auth.actions';
import { specializations } from '../auth/store/auth.selectors';
import { hasPaidHealthTaxesForLastSixMonths } from '../shared/utility';
import { Specialization } from '../shared/models/specialization.enum';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends BaseComponent {
  private subscription = new Subscription();

  readonly healthTaxDate$: Observable<string> = this.store.pipe(select(healthTaxDate), takeUntil(this.destroyed$));
  readonly patient$: Observable<any> = this.store.pipe(select(patient), takeUntil(this.destroyed$));
  readonly doctor$: Observable<any> = this.store.pipe(select(doctor), takeUntil(this.destroyed$));
  readonly doctorVisits$: Observable<any> = this.store.pipe(select(doctorVisits), takeUntil(this.destroyed$));
  readonly doctorPatients$: Observable<any> = this.store.pipe(select(doctorPatients), takeUntil(this.destroyed$));
  readonly specializations$: Observable<Array<Specialization>> = this.store.pipe(select(specializations), takeUntil(this.destroyed$));

  public role: string = localStorage.getItem("role");
  public name: string;
  public healthTaxesPaidUntil: string;
  public healthTaxesArePaid: boolean;
  public doctorSpecializations: Array<Specialization> = [];
  public numberOfDoctorVisits: number;
  public numberOfDoctorPatients: number;
  public doctorPatients: any;
  public allSpecializations: Array<Specialization>;
  public selectedSpecializations: Array<Specialization>;
  public uniqueCitizenNumber: string;
  public uniqueDoctorNumber: string;
  public gpName: string;

  public minDate: Date;
  public selectedDate: Date;

  public get Specialization(): typeof Specialization {
    return Specialization; 
  }

  constructor(private store: Store<AppState>, private datePipe: DatePipe, private actionsSubject$: ActionsSubject) {
    super();

    this.subscription.add(this.actionsSubject$.pipe(filter((action) => action.type === '[Profile Component] Update Doctor Specializations Success'))
    .subscribe(() => {
      this.doctorSpecializations = this.selectedSpecializations;
    }));

    const userId = localStorage.getItem('userId');
    this.store.dispatch(appLoading({ loading: true }));
    if (this.role === 'PATIENT') {
      this.store.dispatch(getPatientById({ id: userId }));

      this.patient$.pipe(takeUntil(this.destroyed$)).subscribe(patient => {
        if (patient) {
          this.name = patient.name;
          this.uniqueCitizenNumber = patient.uniqueCitizenNumber;
          this.gpName = patient.gp.name;
          this.healthTaxesPaidUntil = patient.healthTaxesPaidUntil;
          this.healthTaxesArePaid = hasPaidHealthTaxesForLastSixMonths(this.healthTaxesPaidUntil);
          localStorage.setItem('healthTaxesArePaid', JSON.stringify(this.healthTaxesArePaid));

          if (this.healthTaxesPaidUntil) {
            this.minDate = new Date(this.healthTaxesPaidUntil);
          } else {
            this.minDate = new Date();
          }
        }
      });

      this.healthTaxDate$.pipe(takeUntil(this.destroyed$)).subscribe(healthTaxDate => {
        if (healthTaxDate) {
          this.healthTaxesPaidUntil = localStorage.getItem("healthTaxesPaidUntil");
          this.healthTaxesArePaid = hasPaidHealthTaxesForLastSixMonths(this.healthTaxesPaidUntil);
          localStorage.setItem('healthTaxesArePaid', JSON.stringify(this.healthTaxesArePaid));

          this.minDate = new Date(this.healthTaxesPaidUntil);
        }
      });
    } else if (this.role === 'DOCTOR') {
      this.store.dispatch(getDoctorById({ id: userId }));

      this.store.dispatch(appLoading({ loading: true }));
      this.store.dispatch(getSpecializations());

      this.store.dispatch(appLoading({ loading: true }));
      this.store.dispatch(getDoctorAssignedPatients({ id: userId }));

      this.store.dispatch(appLoading({ loading: true }));
      this.store.dispatch(getDoctorVisits({ id: userId }));

      this.specializations$.pipe(takeUntil(this.destroyed$)).subscribe(specializations => {
        if (specializations) {
          this.allSpecializations = specializations;
        }
      });

      this.doctor$.pipe(takeUntil(this.destroyed$)).subscribe(doctor => {
        if (doctor) {
          this.name = doctor.name;
          this.uniqueDoctorNumber = doctor.uniqueDoctorNumber;
          this.doctorSpecializations = doctor.specializations;
          this.selectedSpecializations = this.doctorSpecializations;
        }
      });

      this.doctorVisits$.pipe(takeUntil(this.destroyed$)).subscribe(doctorVisits => {
        if (doctorVisits) {
          this.numberOfDoctorVisits = doctorVisits.length;
        }
      });

      this.doctorPatients$.pipe(takeUntil(this.destroyed$)).subscribe(doctorPatients => {
        if (doctorPatients) {
          this.numberOfDoctorPatients = doctorPatients.length;
          this.doctorPatients = doctorPatients;
        }
      });
    }
  }

  public payHealthTaxes() {
    const userId = localStorage.getItem('userId');
    const dateToPatch = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
    this.store.dispatch(appLoading({ loading: true }));
    this.store.dispatch(updateHealthTaxDate({ id: userId, date: dateToPatch }));
  }

  public saveSpecializations() {
    const userId = localStorage.getItem('userId');
    const specializations = this.selectedSpecializations;
    this.store.dispatch(appLoading({ loading: true }));
    this.store.dispatch(updateDoctorSpecializations({ id: userId, specializations: specializations }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

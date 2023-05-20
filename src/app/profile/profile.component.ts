import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { BaseComponent } from '../shared/base.component';
import { AppState } from '../shared/models/app-state.interface';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { doctor, doctorPatients, doctorVisits, healthTaxDate, patient } from './store/profile.selectors';
import { getDoctorAssignedPatients, getDoctorById, getDoctorVisits, getPatientById, updateHealthTaxDate } from './store/profile.actions';
import { appLoading } from '../shared/loader/store/loader.actions';
import { getSpecializations } from '../auth/store/auth.actions';
import { specializations } from '../auth/store/auth.selectors';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends BaseComponent {
  readonly healthTaxDate$: Observable<string> = this.store.pipe(select(healthTaxDate), takeUntil(this.destroyed$));
  readonly patient$: Observable<any> = this.store.pipe(select(patient), takeUntil(this.destroyed$));
  readonly doctor$: Observable<any> = this.store.pipe(select(doctor), takeUntil(this.destroyed$));
  readonly doctorVisits$: Observable<any> = this.store.pipe(select(doctorVisits), takeUntil(this.destroyed$));
  readonly doctorPatients$: Observable<any> = this.store.pipe(select(doctorPatients), takeUntil(this.destroyed$));
  readonly specializations$: Observable<any> = this.store.pipe(select(specializations), takeUntil(this.destroyed$));

  public role: string = localStorage.getItem("role");
  public name: string;
  public healthTaxesPaidUntil: string;
  public doctorSpecializations: Array<any> = [];
  public numberOfDoctorVisits: number;
  public numberOfDoctorPatients: number;
  public doctorPatients: any;
  public allSpecializations: any;
  public selectedSpecialization: any;

  public minDate: Date;
  public selectedDate: Date;

  constructor(private store: Store<AppState>, private datePipe: DatePipe) {
    super();

    const userId = localStorage.getItem('userId');
    this.store.dispatch(appLoading({ loading: true }));
    if (this.role === 'STUDENT') {
      this.store.dispatch(getPatientById({ id: userId }));

      this.patient$.pipe(takeUntil(this.destroyed$)).subscribe(patient => {
        if (patient) {
          this.name = localStorage.getItem("name");
          this.healthTaxesPaidUntil = localStorage.getItem("healthTaxesPaidUntil");
        }
      });

      this.minDate = new Date(this.healthTaxesPaidUntil);
  
      this.healthTaxDate$.pipe(takeUntil(this.destroyed$)).subscribe(healthTaxDate => {
        if (healthTaxDate) {
          this.healthTaxesPaidUntil = localStorage.getItem("healthTaxesPaidUntil");
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
          this.name = localStorage.getItem("name");
          this.doctorSpecializations = doctor.specialities;
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
    this.store.dispatch(updateHealthTaxDate({ id: userId, date: dateToPatch }));
  }
}

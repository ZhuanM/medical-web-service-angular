import { Component } from '@angular/core';
import { ActionsSubject, Store, select } from '@ngrx/store';
import { BaseComponent } from '../shared/base.component';
import { AppState } from '../shared/models/app-state.interface';
import { appLoading } from '../shared/loader/store/loader.actions';
import { Observable, Subscription, filter, takeUntil } from 'rxjs';
import { doctorVisits, patientVisits } from './store/visits.selectors';
import { AppService } from '../app.service';
import { getDoctorVisits, getPatientVisits } from './store/visits.actions';
import { ColDef } from 'ag-grid-community';
import { MatButtonModule } from '@angular/material/button';
import { EditButtonRendererComponent } from '../shared/ag-grid-edit-button/edit-button-renderer.component';
import { MessageType } from '../shared/models/message-type.enum';
import { TreatmentRendererComponent } from '../shared/ag-grid-treatment/treatment-renderer.component';

@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.scss'],
})
export class VisitsComponent extends BaseComponent {
  private subscription = new Subscription();

  readonly doctorVisits$: Observable<any> = this.store.pipe(
    select(doctorVisits),
    takeUntil(this.destroyed$)
  );
  readonly patientVisits$: Observable<any> = this.store.pipe(
    select(patientVisits),
    takeUntil(this.destroyed$)
  );

  public doctorVisits: any;
  public patientVisits: any;

  public role: string;

  public frameworkComponents: any;

  public patientCols: Array<ColDef> = [
    {
      field: 'date',
      headerName: 'Visit Date',
      sortable: true,
      filter: true,
      valueFormatter: (params) => {
        if (params.value) {
          const date = new Date(params.value);
          const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          };
          return date.toLocaleDateString('en-GB', options); // Format the date based on your desired format
        }
      },
    },
    {
      field: 'doctor.name',
      headerName: 'Doctor Name',
      sortable: true,
      filter: true,
    },
    {
      field: 'diagnosis',
      headerName: 'Diagnosis',
      sortable: true,
      filter: true,
    },
    {
      field: 'medicaments',
      headerName: 'Treatment',
      sortable: true,
      filter: true,
      cellRenderer: 'treatmentRenderer',
      autoHeight: true
    },
    {
      field: 'sickLeave.startDate',
      headerName: 'Sick Leave From',
      sortable: true,
      filter: true,
      valueFormatter: (params) => {
        if (params.value) {
          const date = new Date(params.value);
          const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          };
          return date.toLocaleDateString('en-GB', options); // Format the date based on your desired format
        }
      },
    },
    {
      field: 'sickLeave.endDate',
      headerName: 'Sick Leave To',
      sortable: true,
      filter: true,
      valueFormatter: (params) => {
        if (params.value) {
          const date = new Date(params.value);
          const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          };
          return date.toLocaleDateString('en-GB', options); // Format the date based on your desired format
        }
      },
    }
  ];

  public doctorCols: Array<ColDef> = [
    {
      field: 'date',
      headerName: 'Visit Date',
      sortable: true,
      filter: true,
      valueFormatter: (params) => {
        if (params.value) {
          const date = new Date(params.value);
          const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          };
          return date.toLocaleDateString('en-GB', options); // Format the date based on your desired format
        }
      },
    },
    {
      field: 'patient.name',
      headerName: 'Patient Name',
      sortable: true,
      filter: true,
    },
    {
      field: 'diagnosis',
      headerName: 'Diagnosis',
      sortable: true,
      filter: true,
    },
    {
      field: 'medicaments',
      headerName: 'Treatment',
      sortable: true,
      filter: true,
      cellRenderer: 'treatmentRenderer',
      autoHeight: true
    },
    {
      field: 'sickLeave.startDate',
      headerName: 'Sick Leave From',
      sortable: true,
      filter: true,
      valueFormatter: (params) => {
        if (params.value) {
          const date = new Date(params.value);
          const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          };
          return date.toLocaleDateString('en-GB', options); // Format the date based on your desired format
        }
      },
    },
    {
      field: 'sickLeave.endDate',
      headerName: 'Sick Leave To',
      sortable: true,
      filter: true,
      valueFormatter: (params) => {
        if (params.value) {
          const date = new Date(params.value);
          const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          };
          return date.toLocaleDateString('en-GB', options); // Format the date based on your desired format
        }
      },
    },
    {
      field: '',
      headerName: 'Action',
      width: 100,
      cellRenderer: 'buttonRenderer',
      cellClass: 'edit-cell'
    },
  ];

  constructor(
    private store: Store<AppState>,
    private actionsSubject$: ActionsSubject,
    private appService: AppService
  ) {
    super();

    this.frameworkComponents = {
      buttonRenderer: EditButtonRendererComponent,
      treatmentRenderer: TreatmentRendererComponent,
    }

    this.role = localStorage.getItem('role');

    const userId = localStorage.getItem('userId');
    this.store.dispatch(appLoading({ loading: true }));
    if (this.role === 'PATIENT') {
      this.store.dispatch(getPatientVisits({ id: userId }));

      this.patientVisits$
        .pipe(takeUntil(this.destroyed$))
        .subscribe((patientVisits) => {
          if (patientVisits) {
            this.patientVisits = patientVisits;
          }
        });
    } else if (this.role === 'DOCTOR') {
      this.store.dispatch(getDoctorVisits({ id: userId }));

      this.doctorVisits$
        .pipe(takeUntil(this.destroyed$))
        .subscribe((doctorVisits) => {
          if (doctorVisits) {
            this.doctorVisits = doctorVisits;
          }
        });
    }

    this.subscription.add(this.actionsSubject$.pipe(filter((action) =>action.type === '[Visits Component] Update Visit Success'))
      .subscribe(() => {
        this.store.dispatch(appLoading({ loading: true }));
        if (this.role === 'PATIENT') {
          this.store.dispatch(getPatientVisits({ id: userId }));
        } else if (this.role === 'DOCTOR') {
          this.store.dispatch(getDoctorVisits({ id: userId }));
        }
        this.appService.openSnackBar('Visit updated successfully!', MessageType.Success);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

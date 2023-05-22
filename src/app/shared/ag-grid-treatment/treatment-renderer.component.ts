import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { AppState } from '../models/app-state.interface';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-button-renderer',
  template: `
    <div *ngIf="params?.value">
      <div *ngFor="let medicament of params.value">
        {{ medicament.medicamentName }}: {{ medicament.dosage }}
      </div>
    </div>
  `,
})
export class TreatmentRendererComponent implements ICellRendererAngularComp {
  public params: any;

  constructor(private store: Store<AppState>, private dialog: MatDialog) {}

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params?: any): boolean {
    return true;
  }
}
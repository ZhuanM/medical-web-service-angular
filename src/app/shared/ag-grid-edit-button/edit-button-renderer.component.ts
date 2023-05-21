import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { EditVisitModalComponent } from '../modals/edit-visit-modal/edit-visit-modal.component';
import { appLoading } from '../loader/store/loader.actions';
import { AppState } from '../models/app-state.interface';
import { Store } from '@ngrx/store';
import { updateVisit } from 'src/app/visits/store/visits.actions';

@Component({
  selector: 'app-button-renderer',
  template: `
    <button mat-button (click)="btnClickedHandler()">Edit</button>
  `,
})
export class EditButtonRendererComponent implements ICellRendererAngularComp {
  private params: any;

  constructor(private store: Store<AppState>, private dialog: MatDialog) {}

  agInit(params: any): void {
    this.params = params;
  }

  btnClickedHandler() {
    const dialogRef = this.dialog.open(EditVisitModalComponent, {
      width: '500px',
      data: this.params.data,
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(appLoading({ loading: true }));
        this.store.dispatch(updateVisit({ id: this.params.data.id, params: result }));
      }
    });
  }

  refresh(params?: any): boolean {
    return true;
  }
}
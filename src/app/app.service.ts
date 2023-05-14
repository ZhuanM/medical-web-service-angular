import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageType } from './shared/models/message-type.enum';
import { AppSnackbarComponent } from './shared/snackbars/app-snackbar/app-snackbar.component';

@Injectable({ providedIn: 'root' })
export class AppService {
  constructor(private snackBar: MatSnackBar) {}
  
  public openSnackBar(message: string, type?: MessageType, indefinite?: boolean) {
    if (indefinite) {
      this.snackBar.openFromComponent(AppSnackbarComponent, {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['mat-toolbar', type || ''],
        data: { message: message, type: type, indefinite: true }
      });
    } else {
      this.snackBar.openFromComponent(AppSnackbarComponent, {
        duration: 2500,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['mat-toolbar', type || ''],
        data: { message: message, type: type }
      });
    }
  }
}

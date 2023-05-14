import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MessageType } from '../../models/message-type.enum';

@Component({
  selector: 'app-snackbar',
  templateUrl: './app-snackbar.component.html',
  styleUrls: ['./app-snackbar.component.scss'],
})
export class AppSnackbarComponent {
  public icon: string = '';
  public message: string;
  public indefinite: boolean;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: {
      message: string;
      type?: MessageType;
      indefinite?: boolean;
    },
    private snackRef: MatSnackBarRef<AppSnackbarComponent>
    ) { }

  ngOnInit() {
    if (this.data) {
      if (this.data.message) {
        this.message = this.data.message;
      }

      if (this.data.type) {
        switch (this.data.type) {
          case MessageType.Success:
            this.icon = 'done';
            break;
          case MessageType.Error:
            this.icon = 'error';
            break;
          case MessageType.Warning:
            this.icon = 'warning';
            break;
          // case MessageType.Info:
          // this.icon = 'info';
          // break;
        }
      }

      if (this.data.indefinite) {
        this.indefinite = this.data.indefinite;
      }
    }
  }

  public get messageType(): typeof MessageType {
    return MessageType; 
  }

  public onOk() {
    this.snackRef.dismiss();
  }
}

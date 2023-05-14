import { Component, EventEmitter, Output } from '@angular/core';
import { BaseComponent } from '../shared/base.component';
import { Store, select } from '@ngrx/store';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import * as AuthActions from '../auth/store/auth.actions';
import * as AuthSelectors from '../auth/store/auth.selectors';
import { takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { appLoading } from '../shared/loader/store/loader.actions';
import { AppState } from '../shared/models/app-state.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent {
  @Output() login = new EventEmitter<boolean>();

  readonly authError$: Observable<string> = this.store.pipe(select(AuthSelectors.authError), takeUntil(this.destroyed$));

  public hideLoginPassword: boolean = true;

  public loginForm = new UntypedFormGroup({
    username: new UntypedFormControl('', [Validators.required]),
    password: new UntypedFormControl('', [Validators.required])
  });

  constructor(
    private store: Store<AppState>,
  ) {
    super();
  }

  public onSubmit() {
    if (this.loginForm.valid) {
      this.store.dispatch(appLoading({ loading: true }));
      this.store.dispatch(AuthActions.login(
        {
          username: this.loginForm.get('username').value,
          password: this.loginForm.get('password').value
        }
      ));
      
      this.login.emit(true);
    }
  }
  
  // ERRORS
  public getLoginUsernameErrorMessage() {
    let username = this.loginForm.get('username');
    if (username.hasError('required')) {
      return 'Please enter your username';
    }

    return username.hasError('username') ? 'Please enter a valid username' : '';
  }

  public getLoginPasswordErrorMessage() {
    let password = this.loginForm.get('password');
    if (password.hasError('required')) {
      return 'Please enter your password';
    }

    return password.hasError('password') ? 'Please enter a valid password' : '';
  }

  ngOnDestroy() {
    this.store.dispatch(AuthActions.resetErrorState());
  }
}

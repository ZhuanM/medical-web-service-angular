import { ChangeDetectorRef, Component } from '@angular/core';
import { BaseComponent } from '../shared/base.component';
import { select, Store } from '@ngrx/store';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import * as AuthActions from '../auth/store/auth.actions';
import * as AuthSelectors from '../auth/store/auth.selectors';
import { appLoading } from '../shared/loader/store/loader.actions';
import { MatRadioChange } from '@angular/material/radio';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppState } from '../shared/models/app-state.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseComponent {
  readonly specializations$: Observable<Array<any>> = this.store.pipe(select(AuthSelectors.specializations), takeUntil(this.destroyed$));

  public specializations: Array<string> = [];

  public hideRegisterPassword: boolean = true;
  public hideRegisterRepeatPassword: boolean = true;

  public classes: Array<string> = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12' ];
  
  public registerForm = new UntypedFormGroup({
    name: new UntypedFormControl('', [Validators.required]),
    username: new UntypedFormControl('', [Validators.required]),
    passwords: new UntypedFormGroup({
      password: new UntypedFormControl('', [Validators.required]),
      repeatPassword: new UntypedFormControl('', [Validators.required]),
    }, this.passwordConfirming),
    role: new UntypedFormControl(''),
    uniqueUserNumber: new UntypedFormControl('', [Validators.required]),
    specialization: new UntypedFormControl(''),
    gp: new UntypedFormControl('', [Validators.required]),
  });
  
  constructor(
    private store: Store<AppState>,
    private cdr: ChangeDetectorRef,
  ) {
    super();

    this.store.dispatch(appLoading({ loading: true }));
    this.store.dispatch(AuthActions.getSpecializations());

    this.specializations$.pipe(takeUntil(this.destroyed$)).subscribe(specializations => {
      if (specializations) {
        this.specializations = specializations;
      }
    });
  }

  ngOnInit() {
    this.registerForm.get('role').setValue('STUDENT');
  }

  public onRadioChange(event: MatRadioChange) {
    if (event.value == 'STUDENT') {
      this.registerForm.get('school').clearValidators();
      this.registerForm.get('school').setValue('');
      this.registerForm.get('school').markAsPristine();
      this.registerForm.get('school').markAsUntouched();

      this.registerForm.get('school').setValidators(Validators.required);

      this.registerForm.get('class').clearValidators();
      this.registerForm.get('class').setValue('');
      this.registerForm.get('class').markAsPristine();
      this.registerForm.get('class').markAsUntouched();

      this.registerForm.get('class').setValidators(Validators.required);
    } else if (event.value == 'TEACHER') {
      this.registerForm.get('class').clearValidators();
      this.registerForm.get('class').setValue('');
      this.registerForm.get('class').markAsPristine();
      this.registerForm.get('class').markAsUntouched();

      this.registerForm.get('school').clearValidators();
      this.registerForm.get('school').setValue('');
      this.registerForm.get('school').markAsPristine();
      this.registerForm.get('school').markAsUntouched();

      this.registerForm.get('school').setValidators(Validators.required);
    }

    this.cdr.detectChanges();
  }

  public onSubmit() {
    if (this.registerForm.valid) {
      this.store.dispatch(appLoading({ loading: true }));
      this.store.dispatch(AuthActions.register(
        {
          name: this.registerForm.get('name').value,
          username: this.registerForm.get('username').value,
          password: this.registerForm.get('passwords')?.get('password').value,
          role: this.registerForm.get('role').value,
          uniqueUserNumber: this.registerForm.get('uniqueUserNumber').value,
          specialization: this.registerForm.get('specialization').value,
          gp: this.registerForm.get('gp').value
        }
      ));
    }
  }

  private passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('repeatPassword').value) {
      return { invalid: true };
    }
  }
  
  // ERRORS
  public getRegisterFirstNameErrorMessage() {
    let firstName = this.registerForm.get('firstName');
    if (firstName.hasError('required')) {
      return 'Please enter your first name';
    }

    return firstName.hasError('firstName') ? 'Please enter a valid first name' : '';
  }

  public getRegisterLastNameErrorMessage() {
    let lastName = this.registerForm.get('lastName');
    if (lastName.hasError('required')) {
      return 'Please enter your last name';
    }

    return lastName.hasError('lastName') ? 'Please enter a valid last name' : '';
  }

  public getRegisterUsernameErrorMessage() {
    let username = this.registerForm.get('username');
    if (username.hasError('required')) {
      return 'Please enter your username';
    }

    return username.hasError('username') ? 'Please enter a valid username' : '';
  }

  public getRegisterEmailErrorMessage() {
    let email = this.registerForm.get('email');
    if (email.hasError('required')) {
      return 'Please enter your email';
    }

    return email.hasError('email') ? 'Please enter a valid email' : '';
  }

  public getPasswordErrorMessage() {
    let password = this.registerForm.get('passwords')?.get('password');
    if (password.hasError('required')) {
      return 'Please enter your password';
    }

    if (password.errors) {
      return 'Please enter a minimum of eight characters, at least one letter, one number and one special character';
    }
    // return password.hasError('password') ? 'Please enter a minimum of eight characters, at least one letter, one number and one special character' : '';
  }

  public getRepeatPasswordErrorMessage() {
    let repeatPassword = this.registerForm.get('passwords')?.get('repeatPassword');
    if (repeatPassword.hasError('required')) {
      return 'Please confirm your password';
    }

    let password = this.registerForm.get('passwords')?.get('password');
    if (password.errors) {
      return 'Please enter a valid password first';
    }

    if (repeatPassword.errors) {
      return 'Password does not match';
    }
    // return repeatPassword.hasError('repeatPassword') ? 'Password does not match' : '';
  }

  ngOnDestroy() {
    this.store.dispatch(AuthActions.resetErrorState());
  }
}

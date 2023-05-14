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
import { Doctor } from '../shared/models/doctor.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseComponent {
  readonly specializations$: Observable<Array<string>> = this.store.pipe(select(AuthSelectors.specializations), takeUntil(this.destroyed$));
  readonly doctors$: Observable<Array<Doctor>> = this.store.pipe(select(AuthSelectors.doctors), takeUntil(this.destroyed$));

  public specializations: Array<string> = [];
  public doctors: Array<Doctor> = [];

  public hideRegisterPassword: boolean = true;
  public hideRegisterRepeatPassword: boolean = true;

  public registerForm = new UntypedFormGroup({
    name: new UntypedFormControl('', [Validators.required]),
    username: new UntypedFormControl('', [Validators.required]),
    passwords: new UntypedFormGroup({
      password: new UntypedFormControl('', [Validators.required]),
      repeatPassword: new UntypedFormControl('', [Validators.required]),
    }, this.passwordConfirming),
    role: new UntypedFormControl('', [Validators.required]),
    uniqueUserNumber: new UntypedFormControl('', [Validators.required]),
    specialization: new UntypedFormControl(''),
    gp: new UntypedFormControl(''),
  });
  
  constructor(
    private store: Store<AppState>,
    private cdr: ChangeDetectorRef,
  ) {
    super();

    this.store.dispatch(appLoading({ loading: true }));
    this.store.dispatch(AuthActions.getSpecializations());
    this.store.dispatch(AuthActions.getDoctors());

    this.specializations$.pipe(takeUntil(this.destroyed$)).subscribe(specializations => {
      if (specializations) {
        this.specializations = specializations;
      }
    });

    this.doctors$.pipe(takeUntil(this.destroyed$)).subscribe(doctors => {
      if (doctors) {
        this.doctors = doctors;
      }
    });
  }

  ngOnInit() {
    this.registerForm.get('role').setValue('PATIENT');
  }

  public onRadioChange(event: MatRadioChange) {
    if (event.value == 'PATIENT') {
      this.registerForm.get('specialization').clearValidators();
      this.registerForm.get('specialization').setValue('');
      this.registerForm.get('specialization').markAsPristine();
      this.registerForm.get('specialization').markAsUntouched();

      this.registerForm.get('gp').clearValidators();
      this.registerForm.get('gp').setValue('');
      this.registerForm.get('gp').markAsPristine();
      this.registerForm.get('gp').markAsUntouched();

      this.registerForm.get('gp').setValidators(Validators.required);
    } else if (event.value == 'DOCTOR') {
      this.registerForm.get('gp').clearValidators();
      this.registerForm.get('gp').setValue('');
      this.registerForm.get('gp').markAsPristine();
      this.registerForm.get('gp').markAsUntouched();

      this.registerForm.get('specialization').clearValidators();
      this.registerForm.get('specialization').setValue('');
      this.registerForm.get('specialization').markAsPristine();
      this.registerForm.get('specialization').markAsUntouched();

      this.registerForm.get('specialization').setValidators(Validators.required);
    }

    this.cdr.detectChanges();
  }

  public onSubmit() {
    if (this.registerForm.valid) {
      this.store.dispatch(appLoading({ loading: true }));
      const role: string = this.registerForm.get('role').value;
      if (role == "PATIENT") {
        this.store.dispatch(AuthActions.registerPatient(
          {
            name: this.registerForm.get('name').value,
            username: this.registerForm.get('username').value,
            password: this.registerForm.get('passwords')?.get('password').value,
            uniqueCitizenNumber: this.registerForm.get('uniqueUserNumber').value,
            gp: this.registerForm.get('gp').value
          }
        ));
      } else if (role == "DOCTOR") {
        this.store.dispatch(AuthActions.registerDoctor(
          {
            name: this.registerForm.get('name').value,
            username: this.registerForm.get('username').value,
            password: this.registerForm.get('passwords')?.get('password').value,
            uniqueDoctorNumber: this.registerForm.get('uniqueUserNumber').value,
            specialization: this.registerForm.get('specialization').value
          }
        ));
      }
    }
  }

  private passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('repeatPassword').value) {
      return { invalid: true };
    }
  }
  
  // ERRORS
  public getRegisterNameErrorMessage() {
    let name = this.registerForm.get('name');
    if (name.hasError('required')) {
      return 'Please enter your first name';
    }

    return name.hasError('name') ? 'Please enter a valid name' : '';
  }

  public getRegisterUsernameErrorMessage() {
    let username = this.registerForm.get('username');
    if (username.hasError('required')) {
      return 'Please enter your username';
    }

    return username.hasError('username') ? 'Please enter a valid username' : '';
  }

  public getRegisterUniqueNumberErrorMessage() {
    let uniqueUserNumber = this.registerForm.get('uniqueUserNumber');
    if (uniqueUserNumber.hasError('uniqueUserNumber')) {
      return 'Please enter your unique number';
    }

    return uniqueUserNumber.hasError('uniqueUserNumber') ? 'Please enter a valid unique number' : '';
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

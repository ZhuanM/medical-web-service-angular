import { Component, EventEmitter, Output } from '@angular/core';
import { ActionsSubject, Store } from '@ngrx/store';
import * as AuthActions from '../auth/store/auth.actions';
import { BaseComponent } from '../shared/base.component';
import { filter, first, takeUntil } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { select } from '@ngrx/store';
import * as HeaderSelectors from '../header/store/header.selectors';
import * as HeaderActions from '../header/store/header.actions';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { user } from '../auth/store/auth.selectors';
import { User } from '../shared/models/user.interface';
import { AppState } from '../shared/models/app-state.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends BaseComponent {
  @Output() logoClicked = new EventEmitter<boolean>();

  private subscription = new Subscription();
  
  readonly sidenavOpened$: Observable<boolean> = this.store.pipe(select(HeaderSelectors.sidenavOpened), takeUntil(this.destroyed$));
  readonly user$: Observable<User> = this.store.pipe(select(user), takeUntil(this.destroyed$));
  
  public role: string;
  public name: string;
  
  public isMobile: boolean = false;

  constructor(
    private store: Store<AppState>,
    private observer: BreakpointObserver,
    private router: Router,
    private actionsSubject$: ActionsSubject,
  ) {
    super();

    this.user$.pipe(takeUntil(this.destroyed$)).subscribe(user => {
      this.role = localStorage.getItem('role');
      this.name = localStorage.getItem('name');
    });

    this.subscription.add(this.actionsSubject$.pipe(filter((action) => action.type === '[Auth Component] Logout Success'))
      .subscribe(() => {
        this.role = localStorage.getItem('role');
        this.name = localStorage.getItem('name');
      }));
  }

  ngOnInit() {
    this.observer.observe(['(max-width: 1024px)']).subscribe((res) => {
      if (res.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }

  public redirectToHome() {
    if (this.router.url == "/home") {
      window.location.reload();
    } else {
      this.logoClicked.emit(true);
    }
  }

  public onLogout() {
    this.store.dispatch(AuthActions.logout());
  }

  private openSidenav() {
    this.store.dispatch(HeaderActions.showSidenav());
  }

  private closeSidenav() {
    this.store.dispatch(HeaderActions.hideSidenav());
  }

  public toggleSidenav() {
    this.sidenavOpened$.pipe(first()).subscribe(open => {
      if (open) {
        return this.closeSidenav();
      }
      
      this.openSidenav();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

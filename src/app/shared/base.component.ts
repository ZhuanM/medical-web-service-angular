import { Component, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  template: ``,
})

export abstract class BaseComponent implements OnDestroy {
  private _destroyed$: ReplaySubject<boolean> = new ReplaySubject(1)

  get destroyed$() {
    return this._destroyed$;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

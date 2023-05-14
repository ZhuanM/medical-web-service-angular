import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { appLoading } from '../shared/loader/store/loader.actions';
import { Store } from '@ngrx/store';
import { finalize} from 'rxjs/operators';
import { getAccessToken } from '../shared/utility';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private store: Store) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.executeCall(req, next);
  }

  private executeCall(req: HttpRequest<any>, next: HttpHandler) {
    const accessToken = getAccessToken();

    if (accessToken) {
      const cloned = req.clone({
        headers: req.headers.set(
          "Authorization", "Bearer " + accessToken
        )
      });
      return next.handle(cloned).pipe(finalize(() => this.store.dispatch(appLoading({ loading: false }))));
    }
    else {
      return next.handle(req).pipe(finalize(() => this.store.dispatch(appLoading({ loading: false }))));
    }
  }
}

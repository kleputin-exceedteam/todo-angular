import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpClient
} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, mergeMap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {loginOut1} from './store/auth/auth.actions';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private http: HttpClient,
              private store: Store) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    if (token) {
      request = request.clone({
        setHeaders: {
          token
        }
      });
    }
    return next.handle(request).pipe(
      catchError(error => {
        if (error.status === 401 && error.error.message === 'Refresh token is not valid') {
          this.store.dispatch(loginOut1());
        }
        if (error.status === 401 && error.error.message === 'Invalid Token') {
          const refToken = localStorage.getItem('refreshToken');
          return this.http.post('api/auth/refresh', {refToken}).pipe(
            mergeMap((res: { token, refreshToken }) => {
                if (!res.token || !res.refreshToken){
                  throw {
                    message: 'No token in refresh response'
                  };
                }
                localStorage.setItem('token', res.token);
                localStorage.setItem('refreshToken', res.refreshToken);
                request = request.clone({
                  setHeaders: {
                    token: res.token
                  }
                });
                return next.handle(request);
              }
            )
          );
        }
        throw error;
      })
    );
  }
}

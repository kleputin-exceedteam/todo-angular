import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {AuthenticationService} from '../services/authentication.service';
import * as AuthActions from './auth.actions';
import {catchError, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';

@Injectable()
export class AuthEffectors {
  constructor(
    private actions$: Actions,
    private service: AuthenticationService
  ) {}
  login$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loginIn),
    mergeMap((action) => this.service.LogIn(action.username, action.password).pipe(
      map(() => AuthActions.loginSuccess()),
      catchError(() => of(AuthActions.loginOut()))
    ))
  ));
  loginOut$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loginOut1),
    tap(() => this.service.LogOut()),
    mergeMap(() => {
      return of(AuthActions.loginOut());
    })
  ));
  createUser$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.signUp),
    mergeMap((action) => this.service.SignUp(action.username, action.password).pipe(
      map(() => AuthActions.loginSuccess()),
      catchError(() => of(AuthActions.loginOut()))
    ))
  ));
}

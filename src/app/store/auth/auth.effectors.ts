import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {AuthenticationService} from '../../services/authentication.service';
import * as AuthActions from './auth.actions';
import {catchError, map, mergeMap, tap} from 'rxjs/operators';
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
      catchError((err) => {
        if (err.status === 404){
          console.log('user not found'); // dispatch some actions
        } else if (err.status === 406){
          console.log('user password\'s is wrong'); // too dispatch
        }
        return of(AuthActions.loginOut());
      })
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

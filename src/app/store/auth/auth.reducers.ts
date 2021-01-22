import * as AuthActions from '../auth/auth.actions';
import { createReducer, on} from '@ngrx/store';
import {initialAuthState} from '../interfaces/auth.interfaces';

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.loginSuccess, (state) => {
    return {
      ...state,
      login: true
    };
  }),
  on(AuthActions.loginOut, (state) => {
    return initialAuthState;
  }),
);

import * as AuthActions from '../auth/auth.actions';
import { createReducer, on} from '@ngrx/store';
import {initialState} from '../interfaces/appState';

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state) => {
    return {
      ...state,
      login: true
    };
  }),
  on(AuthActions.loginOut, (state) => {
    return initialState;
  }),
);

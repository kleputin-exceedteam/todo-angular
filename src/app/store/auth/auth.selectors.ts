import {AppState} from '../interfaces/AppState';
import {createSelector} from '@ngrx/store';
import {AuthState} from '../interfaces/auth.interfaces';

const selectAuthState = (state: { AppState: AppState }): AuthState => {
  return state.AppState.auth;
};

export const selectLoginState = createSelector(
  selectAuthState,
  (state) => {
    return state.login;
  }
);

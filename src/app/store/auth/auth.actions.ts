import {createAction, props} from '@ngrx/store';

export const loginIn = createAction('[Auth] loginIn', props<{username, password}>());
export const loginOut = createAction('[Auth] loginOut');
export const loginOut1 = createAction('[Auth] loginOut1');
export const signUp = createAction('[Auth] signUp', props<{username, password}>());
export const loginSuccess = createAction('[Auth] loginSuccess');

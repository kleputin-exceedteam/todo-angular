import { tasksReducer} from './tasks/tasks.reducers';
import {Action, combineReducers} from '@ngrx/store';
import {authReducer} from './auth/auth.reducers';
import {AppState} from './interfaces/appState';

// tslint:disable-next-line:typedef
export function reducer(state: AppState | undefined, action: Action) {
  return {
     tasksReducer,
     authReducer
  };
}

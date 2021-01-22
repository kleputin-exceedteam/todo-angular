import { tasksReducer} from './tasks/tasks.reducers';
import { combineReducers} from '@ngrx/store';
import {authReducer} from './auth/auth.reducers';

export const reducer = combineReducers({
  InLogin: tasksReducer,
  auth: authReducer
});

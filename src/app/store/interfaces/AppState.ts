import {AuthState} from './auth.interfaces';
import {FilteredState, TasksState} from './tasks.interfaces';

export interface AppState {
  InLogin: InLoginState;
  auth: AuthState;
}

export interface InLoginState {
  tasksState: TasksState;
  filteredTasksState: FilteredState;
  loading: boolean;
  error: boolean;
  crash: boolean;
}

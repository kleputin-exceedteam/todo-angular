import {createSelector} from '@ngrx/store';
import { FilteredState, TasksState} from '../interfaces/tasks.interfaces';
import {selectFilteredTasks} from './tasks.reducers';
import {InLoginState} from '../interfaces/AppState';
import {AppState } from '../interfaces/AppState';

const selectTasksState = (state: { AppState: AppState }): TasksState => {
  return state.AppState.InLogin.tasksState;
};

const selectFilterState = (state: { AppState: AppState }): FilteredState => {
  return state.AppState.InLogin.filteredTasksState;
};

const selectInLoginState = (state: { AppState: AppState }): InLoginState => {
  return state.AppState.InLogin;
};

export const selectErrorState = createSelector(
  selectInLoginState,
  (state: InLoginState): boolean => {
    return state.error;
  }
);

export const selectCrashState = createSelector(
  selectInLoginState,
  (state: InLoginState): boolean => {
    return state.crash;
  }
);

export const selectLoadingState = createSelector(
  selectInLoginState,
  (state: InLoginState): boolean => {
    return state.loading;
  }
);

export const selectFilterList = createSelector(
  selectFilterState,
  selectFilteredTasks
);

export const selectCount = createSelector(
  selectTasksState,
  (state: TasksState): number => {
    return state.count;
  }
);

export const selectAllComp = createSelector(
  selectTasksState,
  (state: TasksState): boolean => {
    return state.all_comp;
  }
);

export const selectCountComp = createSelector(
  selectTasksState,
  (state: TasksState): number => {
    return state.countComp;
  }
);

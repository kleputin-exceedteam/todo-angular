import {createSelector} from '@ngrx/store';
import {AppState, FilteredState, TasksState} from '../interfaces/appState';
import {selectFilteredTasks} from './tasks.reducers';

const selectTasksState = (state: { AppState: AppState }): TasksState => {
  return state.AppState.tasksState;
};

const selectFilterState = (state: { AppState: AppState }): FilteredState => {
  return state.AppState.filteredTasksState;
};

const selectAppState = (state: { AppState: AppState }): AppState => {
  return state.AppState;
};

export const selectErrorState = createSelector(
  selectAppState,
  (state: AppState): boolean => {
    return state.error;
  }
);

export const selectCrashState = createSelector(
  selectAppState,
  (state: AppState): boolean => {
    return state.crash;
  }
);

export const selectLoadingState = createSelector(
  selectAppState,
  (state: AppState): boolean => {
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

export const selectLoginState = createSelector(
  selectAppState,
  (state: AppState): boolean => {
    return state.login;
  }
);

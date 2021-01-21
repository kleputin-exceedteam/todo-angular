import {createSelector} from '@ngrx/store';

import * as fromReducers from './tasks.reducers';

const selectTasksState = (state: {AppState: fromReducers.AppState}): fromReducers.TasksState => {
  return state.AppState.tasksState;
};

const selectFilterState = (state: {AppState: fromReducers.AppState}): fromReducers.FilteredState => {
  return state.AppState.filteredTasksState;
};

const selectAppState = (state: {AppState: fromReducers.AppState}): fromReducers.AppState => {
  return state.AppState;
};

export const selectErrorState = createSelector(
  selectAppState,
  (state: fromReducers.AppState): boolean => {
    return state.error;
  }
);

export const selectCrashState = createSelector(
  selectAppState,
  (state: fromReducers.AppState): boolean => {
    return state.crash;
  }
);

export const selectLoadingState = createSelector(
  selectAppState,
  (state: fromReducers.AppState): boolean => {
    return state.loading;
  }
);

export const selectFilterList = createSelector(
  selectFilterState,
  fromReducers.selectFilteredTasks
);

export const selectCount = createSelector(
  selectTasksState,
  (state: fromReducers.TasksState): number => {
    return state.count;
  }
);

export const selectAllComp = createSelector(
  selectTasksState,
  (state: fromReducers.TasksState): boolean => {
    return state.all_comp;
  }
);

export const selectCountComp = createSelector(
  selectTasksState,
  (state: fromReducers.TasksState): number => {
    return state.countComp;
  }
);

export const selectLoginState = createSelector(
  selectAppState,
  (state: fromReducers.AppState): boolean => {
    return state.login;
  }
)

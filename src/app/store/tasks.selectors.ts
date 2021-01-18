import {createSelector} from '@ngrx/store';

import * as fromReducers from './tasks.reducers';

const selectTasksState = (state: fromReducers.AppState): fromReducers.TasksState => {
  return state.AppState.tasksState;
};

const selectFilterState = (state: fromReducers.AppState): fromReducers.FilteredState => {
  return state.AppState.filteredTasksState;
};

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

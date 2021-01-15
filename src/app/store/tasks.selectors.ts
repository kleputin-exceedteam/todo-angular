import {createSelector} from '@ngrx/store';
import Task from '../models/task';

import {AppState, State} from './tasks.reducers';

const selectTasksState = (state: AppState): State => {
  console.log(555, state);
  return state.tasksState;
};

export const selectFilterList = createSelector(
  selectTasksState,
  (state: State): Task[] => {
    return state.filteredTasks; // это все неправильное определение. нужно найти как правильно определить передачу selectom.
  }
);

export const selectCount = createSelector(
  selectTasksState,
  (state: State): number => {
    return state.count;
  }
);

export const selectAllComp = createSelector(
  selectTasksState,
  (state: State): boolean => {
    return state.all_comp;
  }
);

export const selectCountComp = createSelector(
  selectTasksState,
  (state: State): number => {
    return state.countComp;
  }
);

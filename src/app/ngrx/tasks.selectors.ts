import {createSelector} from '@ngrx/store';
import Task from '../models/task';

import * as Tasks from './tasks.reducers';

const selectTasksState = (state: Tasks.State): any => {
  console.log(555, state.tasks);
  return state.tasks;
};

export const selectFilterList = createSelector(
  selectTasksState,
  (state: Tasks.State): Task[] => {
    return state.filteredTasks; // это все неправильное определение. нужно найти как правильно определить передачу selectom.
  }
);

export const selectCount = createSelector(
  selectTasksState,
  (state: Tasks.State): number => {
    return state.count;
  }
);

export const selectAllComp = createSelector(
  selectTasksState,
  (state: Tasks.State): boolean => {
    return state.all_comp;
  }
);

export const selectCountComp = createSelector(
  selectTasksState,
  (state: Tasks.State): number => {
    return state.countComp;
  }
);

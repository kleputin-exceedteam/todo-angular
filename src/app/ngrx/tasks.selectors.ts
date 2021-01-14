import {createSelector} from '@ngrx/store';
import Task from '../models/task';

import * as Tasks from './tasks.reducers';

const selectTasksState = (state: Tasks.State): any => {
  console.log(555, state.tasks);
  return state.tasks;
};

export const selectTasksList = createSelector(
  selectTasksState,
  (state: Tasks.State): Task[] => {
    console.log(123, state);
    return state.tasks; // это все неправильное определение. нужно найти как правильно определить передачу selectom.
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

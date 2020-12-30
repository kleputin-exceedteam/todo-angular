import {createSelector} from '@ngrx/store';
import Task from '../models/task';

import * as Tasks from './tasks.reducers';

const selectTasksState = (state: Tasks.State): Tasks.State => state;

export const selectTasksList = createSelector(
  selectTasksState,
  (state: Tasks.State): Task[] => state.tasks
);

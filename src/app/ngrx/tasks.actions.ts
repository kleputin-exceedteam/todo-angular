import { createAction, props } from '@ngrx/store';

export const retrievedTasks = createAction('[Tasks] retrievedTasks', props<{Tasks}>());
export const addTask = createAction('[Tasks] addTask', props<{NewTask}>());
export const deleteTask = createAction('[Tasks] deleteTask', props<{id}>());
export const changeStatus = createAction('[Tasks] changeStatus', props<{id, newstatus}>());
export const getTasks = createAction('[Tasks] GetTasks');

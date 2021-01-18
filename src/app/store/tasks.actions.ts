import { createAction, props } from '@ngrx/store';

export const retrievedTasks = createAction('[Tasks] retrievedTasks', props<{Tasks}>());
export const changeFilter = createAction('[Tasks] changeFilter', props<{ newFilter }>());
export const addTask = createAction('[Tasks] addTask', props<{NewTask}>());
export const deleteTask = createAction('[Tasks] deleteTask', props<{id}>());
export const changeStatus = createAction('[Tasks] changeStatus', props<{id, newstatus}>());
export const getTasks = createAction('[Tasks] GetTasks');
export const markAll = createAction('[Tasks] markAll');
export const deleteComp = createAction('[Tasks] deleteComp');
export const changeName = createAction('[Tasks] changeName', props<{id, newname}>());
export const TryChangeName = createAction('[Tasks] TryChangeName', props <{id, newname}>());
export const TryDeleteComp = createAction('[Tasks] TryDeleteComp');
export const TryDelete = createAction('[Tasks] TryDelete', props<{ id }>());
export const TryAdd = createAction('[Tasks] TryAdd', props<{name}>());
export const TryMarkAll = createAction('[Tasks] TryMarkAll');
export const TryChangeStatus = createAction('[Tasks] TryChangeStatus', props<{id, newstatus}>());
export const Error = createAction('[Tasks] Error');

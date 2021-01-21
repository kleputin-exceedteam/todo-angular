import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import Task from '../../models/task';

export interface AppState {
  tasksState: TasksState;
  filteredTasksState: FilteredState;
  loading: boolean;
  error: boolean;
  crash: boolean;
  login: boolean;
}

export interface TasksState extends EntityState<Task> {
  count: number;
  all_comp: boolean;
  countComp: number;
}


export interface FilteredState extends EntityState<Task>{
  filter: number;
}

export function selectTskId(task: Task): string {
  return task._id;
}

export const filterAdapter: EntityAdapter<Task> = createEntityAdapter({
  selectId: selectTskId
});

export const tasksAdapter: EntityAdapter<Task> = createEntityAdapter<Task>({
  selectId: selectTskId
});

/*export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectedUserId: null,
});*/

export const initialState = {
  tasksState: tasksAdapter.getInitialState({
    count: 0,
    all_comp: false,
    countComp: 0
  }),
  filteredTasksState: filterAdapter.getInitialState({
    filter: 1
  }),
  loading: false,
  error: false,
  crash: false,
  login: false
};


export const initialStateTasks: TasksState = tasksAdapter.getInitialState(initialState.tasksState);

export const initialStateFiltered: FilteredState = filterAdapter.getInitialState(initialState.filteredTasksState);

import {Action, createReducer, on} from '@ngrx/store';
import * as TaskActions from './tasks.actions';
import Task from '../models/task';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import * as AuthActions from './auth.actions';

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

export const initialStateTasks: TasksState = tasksAdapter.getInitialState({
  count: 0,
  all_comp: false,
  countComp: 0
});

export const initialStateFiltered: FilteredState = filterAdapter.getInitialState({
  filter: 1
});

export const initialState = {
  tasksState: initialStateTasks,
  filteredTasksState: initialStateFiltered,
  loading: false,
  error: false,
  crash: false,
  login: false
};

export const tasksReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state) => {
    return {
      ...state,
      login: true
    };
  }),
  on(AuthActions.loginOut, (state) => {
    return initialState;
  }),
  on(TaskActions.TryMarkAll, TaskActions.TryChangeName, TaskActions.TryDeleteComp,
    TaskActions.TryChangeStatus, TaskActions.TryAdd, TaskActions.TryDelete, TaskActions.getTasks, (state) => {
    return {
      ...state,
      loading: true
    };
  }),
  on(TaskActions.Error, (state, props) => {
    return {
      ...state,
      error: !props.crash,
      loading: false,
      crash: props.crash
    };
  }),
  on(TaskActions.ResetErrorState, (state) => {
    return {
      ...state,
      error: false
    };
  }),
  on(TaskActions.retrievedTasks, (state, payload) => {
    return {
      ...state,
      loading: false,
      tasksState: tasksAdapter.setAll(payload.Tasks, {
        ...state.tasksState,
        count: payload.Tasks.length,
        all_comp: payload.Tasks.every(task => !task.is_active),
        countComp: payload.Tasks.filter(task => !task.is_active).length
      }),
      filteredTasksState: filterAdapter.setAll(payload.Tasks.filter(task =>
        getFilterBoolean(state.filteredTasksState.filter, task)), state.filteredTasksState)
    };
  }),
  on(TaskActions.addTask, (state, { NewTask }) => {
    const newTaskState = tasksAdapter.addOne(NewTask, {...state.tasksState, count: state.tasksState.count + 1, all_comp: false});
    if (state.filteredTasksState.filter !== 2){
      return {
        ...state,
        loading: false,
        tasksState: newTaskState,
        filteredTasksState: filterAdapter.addOne(NewTask, {...state.filteredTasksState})
      };
    } else {
      return {
        ...state,
        loading: false,
        tasksState: newTaskState
      };
    }
  }),
  on(TaskActions.deleteTask, (state, { id }) => {
    let newCompCount = state.tasksState.countComp;
    if (!state.tasksState.entities[id]?.is_active){
      newCompCount--;
    }
    return {
        ...state,
        loading: false,
        tasksState: tasksAdapter.removeOne(id, {...state.tasksState, count: state.tasksState.count - 1, countComp: newCompCount}),
        filteredTasksState: filterAdapter.removeOne(id, {...state.filteredTasksState})
    };
  }),
  on(TaskActions.changeStatus, (state, props) => {
    let newCompCount = state.tasksState.countComp;
    props.newstatus ? newCompCount-- : newCompCount++;
    let newFilteredState;
    if (state.filteredTasksState.filter === 1){
      newFilteredState = filterAdapter.updateOne({id: props.id, changes: {is_active: props.newstatus}},
        state.filteredTasksState);
    } else {
      newFilteredState = filterAdapter.removeOne(props.id, state.filteredTasksState);
    }
    return {
      ...state,
      loading: false,
      filteredTasksState: newFilteredState,
      tasksState: tasksAdapter.updateOne({id: props.id, changes: {is_active: props.newstatus}},
        {...state.tasksState, countComp: newCompCount})
    };
  }),
  on(TaskActions.markAll, (state) => {
    let CompCount;
    let newFiltered;
    const tasks = Object.values(state.tasksState.entities);
    const isAllWasComp = tasks.every(task => !task.is_active);
    const updates = tasks.map(task => {
      return {
        id: task._id,
        changes: {
          is_active: isAllWasComp
        }
      };
    });
    if (state.filteredTasksState.filter === 1){
      newFiltered = filterAdapter.updateMany(updates, state.filteredTasksState);
    } else if ((isAllWasComp && state.filteredTasksState.filter === 3) || (!isAllWasComp && state.filteredTasksState.filter === 2)){
      newFiltered = filterAdapter.setAll(tasks.map(task => {
        return {
          _id: task._id,
          name: task.name,
          is_active: isAllWasComp
        };
      }), state.filteredTasksState);
    } else {
      newFiltered = filterAdapter.removeAll(state.filteredTasksState);
    }
    isAllWasComp ? CompCount = 0 : CompCount = tasks.length;
    return {
      ...state,
      loading: false,
      tasksState: tasksAdapter.updateMany(updates, {...state.tasksState, countComp: CompCount}),
      filteredTasksState: newFiltered
    };
  }),
  on(TaskActions.deleteComp, (state) => {
    const countDelComp = Object.values(state.tasksState.entities).filter(task => !task.is_active).length;
    return {
      ...state,
      loading: false,
      tasksState: tasksAdapter.removeMany(task => !task.is_active, {
        ...state.tasksState,
        countComp: state.tasksState.countComp - countDelComp,
        count: state.tasksState.count - countDelComp
      }),
      filteredTasksState: filterAdapter.removeMany(task => !task.is_active, state.filteredTasksState)
    };
  }),
  on(TaskActions.changeFilter, (state, props) => {
    const tasks = Object.values(state.tasksState.entities);
    return {
      ...state,
      loading: false,
      filteredTasksState: filterAdapter.setAll(tasks.filter(task => getFilterBoolean(props.newFilter, task)),
        { ...state.filteredTasksState, filter: props.newFilter })
    };
  }),
  on(TaskActions.changeName, (state, props) => {
    return {
      ...state,
      loading: false,
      tasksState: tasksAdapter.updateOne({id: props.id, changes: {name: props.newname}}, state.tasksState),
      filteredTasksState: filterAdapter.updateOne({id: props.id, changes: {name: props.newname}}, state.filteredTasksState)
    };
  }));

// tslint:disable-next-line:typedef
export function reducer(state: AppState | undefined, action: Action) {
  return tasksReducer(state, action);
}

const {
  selectAll
} = filterAdapter.getSelectors();

export const selectFilteredTasks = selectAll;

function getFilterBoolean(filter: number, task: Task): boolean {
  if (filter === 1) {
    return true;
  } else if (filter === 2 && !task.is_active) {
    return true;
  } else if (filter === 3 && task.is_active) {
    return true;
  }
}

import {Action, createReducer, on} from '@ngrx/store';
import {addTask, changeFilter, changeName, changeStatus, deleteComp, deleteTask, markAll, retrievedTasks} from './tasks.actions';
import Task from '../models/task';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';

export interface AppState {
  tasksState: TasksState;
  filteredTasksState: FilteredState;
}

export interface TasksState extends EntityState<Task> {
  count: number;
  all_comp: boolean;
  countComp: number;
}

export interface FilteredState extends EntityState<Task>{
  filter: number;
}

export const filterAdapter: EntityAdapter<Task> = createEntityAdapter({
  selectId: selectTskId
});

export function selectTskId(a: Task): string {
  return a._id;
}

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
  filteredTasksState: initialStateFiltered
};

export const tasksReducer = createReducer(
  initialState,
  on(retrievedTasks, (state, payload) => {
    return {
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
  on(addTask, (state, { NewTask }) => {
    const newTaskState = tasksAdapter.addOne(NewTask, {...state.tasksState, count: state.tasksState.count + 1, all_comp: false});
    if (state.filteredTasksState.filter !== 2){
      return {
        tasksState: newTaskState,
        filteredTasksState: filterAdapter.addOne(NewTask, {...state.filteredTasksState})
      };
    } else {
      return {
        ...state,
        tasksState: newTaskState
      };
    }
  }),
  on(deleteTask, (state, { id }) => {
    let newCompCount = state.tasksState.countComp;
    if (!state.tasksState.entities[id]?.is_active){
      newCompCount--;
    }
    return {
        tasksState: tasksAdapter.removeOne(id, {...state.tasksState, count: state.tasksState.count - 1, countComp: newCompCount}),
        filteredTasksState: filterAdapter.removeOne(id, {...state.filteredTasksState})
    };
  }),
  on(changeStatus, (state, props) => {
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
      filteredTasksState: newFilteredState,
      tasksState: tasksAdapter.updateOne({id: props.id, changes: {is_active: props.newstatus}},
        {...state.tasksState, countComp: newCompCount})
    };
  }),
  on(markAll, (state) => {
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
      tasksState: tasksAdapter.updateMany(updates, {...state.tasksState, countComp: CompCount}),
      filteredTasksState: newFiltered
    };
}),
  on(deleteComp, (state) => {
    const countDelComp = Object.values(state.tasksState.entities).filter(task => !task.is_active).length;
    return {
      tasksState: tasksAdapter.removeMany(task => !task.is_active, {
        ...state.tasksState,
        countComp: state.tasksState.countComp - countDelComp,
        count: state.tasksState.count - countDelComp
      }),
      filteredTasksState: filterAdapter.removeMany(task => !task.is_active, state.filteredTasksState)
    };
  }),
  on(changeFilter, (state, props) => {
    const tasks = Object.values(state.tasksState.entities);
    return {
      ...state,
      filteredTasksState: filterAdapter.setAll(tasks.filter(task => getFilterBoolean(props.newFilter, task)),
        { ...state.filteredTasksState, filter: props.newFilter })
    };
  }),
  on(changeName, (state, props) => {
    return {
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

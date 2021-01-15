import {Action, createReducer, on} from '@ngrx/store';
import {addTask, changeFilter, changeName, changeStatus, deleteComp, deleteTask, markAll, retrievedTasks} from './tasks.actions';
import Task from '../models/task';
import {getNewStateChangeName, getNewStateChangeStatus, getNewStateMarkAll} from './reducer.createNewStates';

export interface AppState {
  tasksState: State;
}

export interface State {
  tasks: Task[];
  count: number;
  all_comp: boolean;
  filteredTasks: Task[];
  filter: number;
  countComp: number;
}
export const initialState: State = {
  tasks: [],
  count: 0,
  all_comp: false,
  filteredTasks: [],
  filter: 1,
  countComp: 0
};

export const tasksReducer = createReducer(
  initialState,
  on(retrievedTasks, (state, payload) => {
    return {
      ...state,
      tasks: payload.Tasks,
      count: payload.Tasks.length,
      all_comp: payload.Tasks.every(task => !task.is_active),
      filteredTasks: payload.Tasks.filter(task => {
        if (state.filter === 1) {
          return true;
        } else if (state.filter === 2 && !task.is_active) {
          return true;
        } else if (state.filter === 3 && task.is_active) {
          return true;
        }
      }),
      countComp: payload.Tasks.filter(task => !task.is_active).length
    };
  }),
  on(addTask, (state, { NewTask }) => {
    if (state.filter !== 2){
      return {
        ...state,
        tasks: [...state.tasks, NewTask],
        count: state.count + 1,
        all_comp: false,
        filteredTasks: [...state.filteredTasks, NewTask]
      };
    } else {
      return {
        ...state,
        tasks: [...state.tasks, NewTask],
        count: state.count + 1,
        all_comp: false
      };
    }
  }),
  on(deleteTask, (state, { id }) => {
    let newCompCount = state.countComp;
    if (!state.tasks.find(task => task._id === id).is_active){
      newCompCount--;
    }
    return {
      ...state,
      tasks: state.tasks.filter(task => task._id !== id),
      count: state.count - 1,
      all_comp: state.tasks.every(task => !task.is_active),
      filteredTasks: state.tasks.filter(task => task._id !== id),
      countComp: newCompCount
    };
  }),
  on(changeStatus, (state, props) => {
    const result = getNewStateChangeStatus(state, props);
    return {...state, tasks: result.newTasks, count: result.newTasks.length, all_comp: result.newAllComp,
      filteredTasks: result.newFilteredTasks,
      countComp: result.newCountComp
    };
  }),
  on(markAll, (state) => {
    const result = getNewStateMarkAll(state);
    return {...state, tasks: result.newTasks, count: result.newTasks.length,
      filteredTasks: result.newFilteredTasks, countComp: result.newCountComp};
}),
  on(deleteComp, (state) => {
    const newarray = state.tasks.filter(task => task.is_active);
    switch (state.filter){
      case 1: // chosen filter allTasks
        return {...state, filteredTasks: state.filteredTasks.filter(task => task.is_active),
          tasks: newarray, countComp: 0, count: newarray.length};
      case 2: // chosen filter completedTasks
        return {...state, filteredTasks: [], tasks: newarray, countComp: 0, count: newarray.length};
      case 3: // chosen filter activeTasks
        return {...state, tasks: newarray, countComp: 0, count: newarray.length};
    }
  }),
  on(changeFilter, (state, props) => {
    switch (props.newFilter){
      case 1:
        return {
          ...state,
          filter: props.newFilter,
          filteredTasks: state.tasks
        };
      case 2:
        return {
          ...state,
          filter: props.newFilter,
          filteredTasks: state.tasks.filter(task => !task.is_active)
        };
      case 3:
        return {
          ...state,
          filter: props.newFilter,
          filteredTasks: state.tasks.filter(task => task.is_active)
        };
    }
  }),
  on(changeName, (state, props) => {
    const result = getNewStateChangeName(state, props);
    return {
      ...state,
      tasks: result.tasks,
      filteredTasks: result.FilteredTask
    };
  }));

// tslint:disable-next-line:typedef
export function reducer(state: State | undefined, action: Action) {
  return tasksReducer(state, action);
}

import {createReducer, on} from '@ngrx/store';
import {addTask, changeStatus, deleteTask, retrievedTasks} from './tasks.actions';
import Task from '../models/task';

export interface State {
  tasks: Task[];
}
export const initialState: State = {tasks: []};

export const tasksReducer = createReducer(
  initialState,
  on(retrievedTasks, (state, { Tasks }) => ({
    ...state,
    tasks: Tasks
  })),
  on(addTask, (state, { NewTask }) => ({
    ...state,
    tasks: [...state.tasks, NewTask]
  })),
  on(deleteTask, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(val => val._id !== id)
  })),
  on(changeStatus, (state, { id, newstatus }) => {
    const newtasks = state.tasks.slice(0);
    const index = newtasks.findIndex(value => value._id === id);
    const NewTask = {
      _id: newtasks[index]._id,
      name: newtasks[index].name,
      is_active: newstatus
    };
    newtasks.splice(index, 1, NewTask);
    return {tasks: newtasks};
  }));

// tslint:disable-next-line:typedef
export function reducer(state: State | undefined, action) {
  return tasksReducer(state, action);
}

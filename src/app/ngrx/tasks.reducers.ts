import {createReducer, on} from '@ngrx/store';
import {addTask, changeStatus, deleteTask, markAll, retrievedTasks} from './tasks.actions';
import Task from '../models/task';

export interface State {
  tasks: Task[];
  count: number;
  all_comp: boolean;
}
export const initialState: State = {
  tasks: [],
  count: 0,
  all_comp: false
};

export const tasksReducer = createReducer(
  initialState,
  on(retrievedTasks, (state, payload) => {
    console.log(payload.Tasks);
    const newState = {
      ...state,
      tasks: payload.Tasks,
      count: payload.Tasks.length,
      all_comp: payload.Tasks.every(val => !val.is_active)
    };
    console.log(444, newState);
    return newState;
  }),
  on(addTask, (state, { NewTask }) => ({
    ...state,
    tasks: [...state.tasks, NewTask],
    count: state.count + 1,
    all_comp: false
  })),
  on(deleteTask, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(val => val._id !== id),
    count: state.count - 1,
    all_comp: state.tasks.every(val => !val.is_active)
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
    return {tasks: newtasks, count: newtasks.length, all_comp: newtasks.every(val => !val.is_active)};
  }),
  on(markAll, (state) => {
    const allcompleted = state.tasks.every(val => !val.is_active);
    const newarray = [];
    if (allcompleted){
      state.tasks.forEach(val => newarray.push({_id: val._id, name: val.name, is_active: true}));
    } else {
      state.tasks.forEach(val => newarray.push({_id: val._id, name: val.name, is_active: false}));
    }
    return {tasks: newarray, count: newarray.length, all_comp: allcompleted};
}));

// tslint:disable-next-line:typedef
export function reducer(state: State | undefined, action) {
  return tasksReducer(state, action);
}

import {createReducer, on} from '@ngrx/store';
import {addTask, changeFilter, changeName, changeStatus, deleteComp, deleteTask, markAll, retrievedTasks} from './tasks.actions';
import Task from '../models/task';

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
  on(changeStatus, (state, { id, newstatus }) => {
    const newtasks = state.tasks.slice(0);
    const index = newtasks.findIndex(task => task._id === id);
    const NewTask = {
      _id: newtasks[index]._id,
      name: newtasks[index].name,
      is_active: newstatus
    };
    newtasks.splice(index, 1, NewTask);
    const newFiltered = newtasks.filter(task => {
      if (state.filter === 1) {
        return true;
      } else if (state.filter === 2 && !task.is_active) {
        return true;
      } else if (state.filter === 3 && task.is_active) {
        return true;
      }
    });
    let newCountComp = state.countComp;
    newstatus ? newCountComp-- : newCountComp++;
    return {...state, tasks: newtasks, count: newtasks.length, all_comp: newtasks.every(task => !task.is_active),
      filteredTasks: newFiltered,
      countComp: newCountComp
    };
  }),
  on(markAll, (state) => {
    const allcompleted = state.tasks.every(task => !task.is_active);
    const newarray = [];
    if (allcompleted){
      state.tasks.forEach(task => newarray.push({_id: task._id, name: task.name, is_active: true}));
    } else {
      state.tasks.forEach(task => newarray.push({_id: task._id, name: task.name, is_active: false}));
    }
    let newFiltered = [];
    let newCompCount;
    allcompleted ? newCompCount = 0 : newCompCount = newarray.length;
    if (state.filter === 1){
      newFiltered = newarray;
    } else if (state.filter === 2){
      if (!allcompleted){
        newFiltered = newarray;
      } else {
        newFiltered = [];
      }
    } else if (state.filter === 3){
      if (!allcompleted){
        newFiltered = [];
      } else {
        newFiltered = newarray;
      }
    }
    return {...state, tasks: newarray, count: newarray.length, filteredTasks: newFiltered, countComp: newCompCount};
}),
  on(deleteComp, (state) => {
    const newarray = state.tasks.filter(task => task.is_active);
    if (state.filter === 1){
      return {...state, filteredTasks: state.filteredTasks.filter(task => task.is_active),
        tasks: newarray, countComp: 0, count: newarray.length};
    } else if (state.filter === 2){
      return {...state, filteredTasks: [], tasks: newarray, countComp: 0, count: newarray.length};
    } else if (state.filter === 3){
      return {...state, tasks: newarray, countComp: 0, count: newarray.length};
    }
  }),
  on(changeFilter, (state, props) => {
    if (props.newFilter === 1){
      return {
        ...state,
        filter: props.newFilter,
        filteredTasks: state.tasks
      };
    } else if (props.newFilter === 2){
      return {
        ...state,
        filter: props.newFilter,
        filteredTasks: state.tasks.filter(task => !task.is_active)
      };
    } else {
      return {
        ...state,
        filter: props.newFilter,
        filteredTasks: state.tasks.filter(task => task.is_active)
      };
    }
  }),
  on(changeName, (state, props) => {
    const newTask = {
      _id: props.id,
      name: props.newname,
      is_active: state.tasks.find(task => task._id === props.id).is_active
    };
    const indexFiltered = state.filteredTasks.findIndex(task => task._id === props.id);
    const newFilteredArr = state.filteredTasks.slice(0);
    const index = state.tasks.findIndex(task => task._id === props.id);
    const newArray = state.tasks.slice(0);
    newArray.splice(index, 1, newTask);
    newFilteredArr.splice(indexFiltered, 1, newTask);
    return {
      ...state,
      tasks: newArray,
      filteredTasks: newFilteredArr
    };
  }));

// tslint:disable-next-line:typedef
export function reducer(state: State | undefined, action) {
  return tasksReducer(state, action);
}

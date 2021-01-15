import Task from '../models/task';

/* It is complex generation new states */

export function getNewStateChangeName(state, props): {tasks: Task[]; FilteredTask: Task[]; } {
  const newTask = {
    _id: props.id,
    name: props.newname,
    is_active: state.tasks.find(task => task._id === props.id).is_active
  };
  const indexFiltered = state.filteredTasks.findIndex(task => task._id === props.id);
  const newFilteredArr = state.filteredTasks.slice(0);
  const index = state.tasks.findIndex(task => task._id === props.id);
  const NewTasks = state.tasks.slice(0);
  NewTasks.splice(index, 1, newTask);
  newFilteredArr.splice(indexFiltered, 1, newTask);
  return { tasks: NewTasks, FilteredTask: newFilteredArr};
}

export function getNewStateMarkAll(state): {newTasks: Task[]; newFilteredTasks: Task[], newCountComp: number; } {
  const IsAllWasComp = state.tasks.every(task => !task.is_active);
  const tasks = [];
  let newFiltered = [];
  let CompCount;
  if (IsAllWasComp){
    state.tasks.forEach(task => tasks.push({_id: task._id, name: task.name, is_active: true}));
  } else {
    state.tasks.forEach(task => tasks.push({_id: task._id, name: task.name, is_active: false}));
  }
  IsAllWasComp ? CompCount = 0 : CompCount = tasks.length;
  switch (state.filter) {
    case 1: // chosen filter allTasks
      newFiltered = tasks;
      break;
    case 2: // chosen filter completedTasks
      !IsAllWasComp ? newFiltered = tasks : newFiltered = [];
      break;
    case 3: // chosen filter activeTasks
      !IsAllWasComp ? newFiltered = [] : newFiltered = tasks;
      break;
  }
  return {newTasks: tasks, newFilteredTasks: newFiltered, newCountComp: CompCount};
}

export function getNewStateChangeStatus(state, props): {newTasks: Task[]; newAllComp: boolean;
                                                        newFilteredTasks: Task[]; newCountComp: number; } {
  const tasks = state.tasks.slice(0);
  const index = tasks.findIndex(task => task._id === props.id);
  const NewTask = {
    _id: tasks[index]._id,
    name: tasks[index].name,
    is_active: props.newstatus
  };
  tasks.splice(index, 1, NewTask);
  const newFiltered = tasks.filter(task => {
    if (state.filter === 1) {
      return true;
    } else if (state.filter === 2 && !task.is_active) {
      return true;
    } else if (state.filter === 3 && task.is_active) {
      return true;
    }
  });
  let CountComp = state.countComp;
  props.newstatus ? CountComp-- : CountComp++;
  return {newTasks: tasks, newAllComp: tasks.every(task => !task.is_active),
    newFilteredTasks: newFiltered, newCountComp: CountComp};
}

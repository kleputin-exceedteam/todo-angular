import Task from '../../models/task';

export function getFilterBoolean(filter: number, task: Task): boolean {
  if (filter === 1) {
    return true;
  } else if (filter === 2 && !task.is_active) {
    return true;
  } else if (filter === 3 && task.is_active) {
    return true;
  }
}

import {EventEmitter, Injectable} from '@angular/core';
import { TASKS } from './task-data';
import Task from './task';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TaskserviceService {
  private tasks = TASKS;
  filter = 1;
  private filteredTasks: Task[] = this.tasks;
  private freeId: number = this.tasks.length + 1;
  private leftItemsCount = this.tasks.filter(value => value.is_active).length;
  private needDisplayFilter = this.tasks.length > 0;
  private needClear = this.tasks.length - this.leftItemsCount > 0;

  taskObs: Subject<Task[]> = new BehaviorSubject<Task[]>(this.filteredTasks);
  needFilter: Subject<boolean> = new BehaviorSubject(this.needDisplayFilter);
  leftItems: Subject<number> = new BehaviorSubject<number>(this.leftItemsCount);
  needClearSub: Subject<boolean> = new BehaviorSubject(this.needClear);

  constructor() { }

  private updateId(): void{
    this.freeId++;
  }

  clearComp(): void{
    this.tasks = this.tasks.filter(value => value.is_active);
    this.filterTasks();
    this.needFilter.next(this.tasks.length > 0);
    this.needClearSub.next(false);
  }

  getFreeId(): number{
    return this.freeId;
  }

  setChecked(id: number): void {
    const index = this.tasks.findIndex(value => value.id === id);
    this.tasks[index].is_active = !this.tasks[index].is_active;
    this.filterTasks();
    this.updateLeftCount();
    this.needClearSub.next((this.tasks.length - this.leftItemsCount) > 0);
  }

  deleteById(id: number): void{
    const index = this.tasks.findIndex(value => value.id === id);
    this.tasks.splice(index, 1);
    this.filterTasks();
    this.updateLeftCount();
    this.needFilter.next(this.tasks.length > 0);
    this.needClearSub.next((this.tasks.length - this.leftItemsCount) > 0);
  }
  addTask(task: Task): void {
    this.tasks.push(task);
    this.updateId();
    this.filterTasks();
    this.updateLeftCount();
    this.needFilter.next(this.tasks.length > 0);
  }

  changeNameById(name: string, id: number): void{
    const index = this.tasks.findIndex(value => value.id === id);
    this.tasks[index].name = name;
  }

  markTask(): void{
    if (this.tasks.every(value => !(value.is_active))){
      this.tasks.forEach(value => value.is_active = true);
    } else {
      this.tasks.forEach(value => value.is_active = false);
    }
    this.updateLeftCount();
    this.filterTasks();
    this.needClearSub.next((this.tasks.length - this.leftItemsCount) > 0);
  }

  changeFilter(num: number): void{
    this.filter = num;
    this.filterTasks();
  }

  private filterTasks(): void {
    if (this.filter === 2){
      this.filteredTasks = this.tasks.filter(value => !value.is_active);
      this.taskObs.next(this.filteredTasks);
    } else if (this.filter === 3){
      this.filteredTasks = this.tasks.filter(value => value.is_active);
      this.taskObs.next(this.filteredTasks);
    } else {
      this.filteredTasks = this.tasks;
      this.taskObs.next(this.filteredTasks);
    }
  }

  getFilteredTasks(): Subject<Task[]>{
    return this.taskObs;
  }

  getLeftItems(): Subject<number>{
    return this.leftItems;
  }
  getNeedFilter(): Subject<boolean>{
    return this.needFilter;
  }

  getNeedClear(): Subject<boolean>{
    return this.needClearSub;
  }

  private updateLeftCount(): void{
    this.leftItemsCount = this.tasks.filter(value => value.is_active).length;
    this.leftItems.next(this.leftItemsCount);
  }
}

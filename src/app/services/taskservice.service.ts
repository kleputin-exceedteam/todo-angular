import { Injectable} from '@angular/core';
import Task from '../models/task';
import {BehaviorSubject, Subject} from 'rxjs';
import {ServerserviceService} from './serverservice.service';
import {Store} from '@ngrx/store';
import {addTask, deleteTask} from '../ngrx/tasks.actions';

@Injectable({
  providedIn: 'root'
})

export class TaskserviceService {
  tasks: Task[] = [];

  filter = 1;

  constructor(private service: ServerserviceService,
              private store: Store) {
  }

  private filteredTasks: Task[] = this.tasks;
  private leftItemsCount = this.tasks.filter(value => value.is_active).length;
  private needDisplayFilter = this.tasks.length > 0;
  private needClear = this.tasks.length - this.leftItemsCount > 0;

  taskObs: Subject<Task[]> = new BehaviorSubject<Task[]>(this.filteredTasks);
  needFilter: Subject<boolean> = new BehaviorSubject(this.needDisplayFilter);
  leftItems: Subject<number> = new BehaviorSubject<number>(this.leftItemsCount);
  needClearSub: Subject<boolean> = new BehaviorSubject(this.needClear);

  clearComp(): void{
    this.service.deleteCompleted().subscribe(res => {
      if (res.code === 200){
        this.tasks = this.tasks.filter(value => value.is_active);
        this.filterTasks();
        this.needFilter.next(this.tasks.length > 0);
        this.needClearSub.next(false);
      } else {
        console.log('Error to clear completed tasks', res.error);
      }
    });
  }

  setChecked(id: string): void {
    /*const index = this.tasks.findIndex(value => value._id === id);
    const status = !this.tasks[index].is_active;*/
   /* this.service.changeStatus(id, status).subscribe(res => {
      if (res.code === 202){

        /!*this.tasks[index].is_active = status;
        this.filterTasks();
        this.updateLeftCount();
        this.needClearSub.next((this.tasks.length - this.leftItemsCount) > 0);*!/
      } else {
        console.log('Server not change status', res.error);
      }
    });*/
  }

  deleteById(id: string): void{
    this.service.deleteTask(id).subscribe(res => {
      if (res.code === 200){
        this.store.dispatch(deleteTask({id}));
        /*const index = this.tasks.findIndex(value => value._id === id);
        this.tasks.splice(index, 1);
        this.filterTasks();
        this.updateLeftCount();
        this.needFilter.next(this.tasks.length > 0);
        this.needClearSub.next((this.tasks.length - this.leftItemsCount) > 0);*/
      } else {
        console.log('delete failed');
      }
    });
  }
  addTask(newname: string): void {
    this.service.pushTask(newname).subscribe(res => {
      if (res.code === 201){
        const NewTask = {_id: res._id.toString(), name: newname, is_active: true};
        this.store.dispatch(addTask({NewTask}));
/*        this.updateLeftCount();
        this.needFilter.next(this.tasks.length > 0);*/
      } else if (res.code === 208) {
        alert('Already exists');
      } else {
        console.log('Something wrong!', res);
      }
    });
  }

  changeNameById(name: string, id: string): void{
    this.service.changeName(id, name).subscribe(res => {
      if (res.code === 200){
        const index = this.tasks.findIndex(value => value._id === id);
        this.tasks[index].name = name;
      } else if (res.code === 208) {
       alert('Already exists');
      } else {
        console.log('Error in change name');
      }
    });
  }

  markTask(): void{
    if (this.tasks.every(value => !(value.is_active))){
      this.service.changeAllStatus(true).subscribe(res => {
        if (res.code === 200){
          this.tasks.forEach(value => value.is_active = true);
          this.updateLeftCount();
          this.filterTasks();
          this.needClearSub.next((this.tasks.length - this.leftItemsCount) > 0);
        } else {
          console.log('Failed to change status to active');
        }
      });
    } else {
      this.service.changeAllStatus(false).subscribe(res => {
        if (res.code === 200){
          this.tasks.forEach(value => value.is_active = false);
          this.updateLeftCount();
          this.filterTasks();
          this.needClearSub.next((this.tasks.length - this.leftItemsCount) > 0);
        } else {
          console.log('Failed to change status to completed');
        }
      });
    }
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
  UpdateServiceData(tasks: Task[]): void{
    this.tasks = tasks;
    this.filterTasks();
    this.updateLeftCount();
    this.getNeedFilter().next(this.tasks.length > 0);
    this.getLeftItems().next(this.tasks.filter(value => value.is_active).length);
    this.getNeedClear().next(this.tasks.length - this.leftItemsCount > 0);
  }
}

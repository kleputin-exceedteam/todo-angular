import {Component, OnInit} from '@angular/core';
import Task from '../models/task';
import {Store} from '@ngrx/store';
import {selectFilterList} from '../ngrx/tasks.selectors';
import {ServerserviceService} from '../services/serverservice.service';
import { TryChangeStatus, TryDelete} from '../ngrx/tasks.actions';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  tasks: Task[] = [];
  newTasks$: Observable<Task[]> = this.store.select(selectFilterList);

  enabledEditTask: Task = null;

  constructor(private service: ServerserviceService,
              private store: Store) {
  }

  /*changeName(name: string): void{
    this.newname = name;
  }


  clickSpan(e: any, taskToEdit: Task): void{
    e.preventDefault();
    this.enabledEditTask = taskToEdit;
  }
  sendName(id: string): void{
    if (this.newname.trim().length > 0) {
      this.service.changeNameById(this.newname.trim(), id);
      this.enabledEditTask = null;
    } else {
      alert('Enter correct value');
    }
  }*/

  ngOnInit(): void {
  }

  deleteItem(id: string): void{
    this.store.dispatch(TryDelete({id}));
  }

  markAsComp(id: string, newstatus: boolean): void {
    this.store.dispatch(TryChangeStatus({id, newstatus}));
  }
}

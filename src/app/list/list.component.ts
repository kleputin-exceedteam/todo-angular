import {Component, OnInit} from '@angular/core';
import Task from '../models/task';
import {Store} from '@ngrx/store';
import {selectFilterList} from '../store/tasks.selectors';
import {ServerService} from '../services/server.service';
import {Error, TryChangeName, TryChangeStatus, TryDelete} from '../store/tasks.actions';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  newTasks$: Observable<Task[]> = this.store.select(selectFilterList);
  newname: string;

  enabledEditTask: Task = null;

  constructor(private service: ServerService,
              private store: Store) {
  }

  changeName(name: string): void{
    this.newname = name;
  }


  clickSpan(e: any, taskToEdit: Task): void{
    e.preventDefault();
    this.enabledEditTask = taskToEdit;
  }
  sendName(input: any, id: string, oldname: string): void{
    if (this.newname.trim().length > 0) {
      this.store.dispatch(TryChangeName({id, newname: this.newname.trim()}));
      this.enabledEditTask = null;
    } else {
      this.store.dispatch(Error({crash: false}));
    }
    input.value = oldname;
  }

  ngOnInit(): void {
  }

  deleteItem(id: string): void{
    this.store.dispatch(TryDelete({id}));
  }

  markAsComp(id: string, newstatus: boolean): void {
    this.store.dispatch(TryChangeStatus({id, newstatus}));
  }
}

import {Component, OnInit} from '@angular/core';
import {TaskserviceService} from './services/taskservice.service';
import {ServerserviceService} from './services/serverservice.service';
import {Store} from '@ngrx/store';
import {getTasks} from './ngrx/tasks.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'todos';
  constructor(private service: TaskserviceService,
              private serv: ServerserviceService,
              private store: Store) {
  }
  ngOnInit(): void {
    this.store.dispatch(getTasks());
  }
}

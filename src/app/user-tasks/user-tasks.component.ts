import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {selectCrashState, selectErrorState, selectLoadingState} from '../store/tasks/tasks.selectors';
import {ServerService} from '../services/server.service';
import {Store} from '@ngrx/store';
import {getTasks, ResetErrorState} from '../store/tasks/tasks.actions';
import {loginOut1} from '../store/auth/auth.actions';

@Component({
  selector: 'app-user-tasks',
  templateUrl: './user-tasks.component.html',
  styleUrls: ['./user-tasks.component.css']
})
export class UserTasksComponent implements OnInit {

  title = 'todos';

  loading: Observable<boolean> = this.store.select(selectLoadingState);
  error: Observable<boolean> = this.store.select(selectErrorState);
  crash: Observable<boolean> = this.store.select(selectCrashState);

  constructor(
    private serv: ServerService,
    private store: Store) {
  }

  resetErr(): void{
    this.store.dispatch(ResetErrorState());
  }
  ngOnInit(): void {
    this.store.dispatch(getTasks());
  }
  loginOut(): void{
    this.store.dispatch(loginOut1());
  }
}

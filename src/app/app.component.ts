import {Component, OnInit} from '@angular/core';
import {ServerService} from './services/server.service';
import {Store} from '@ngrx/store';
import {getTasks, ResetErrorState} from './store/tasks.actions';
import {Observable} from 'rxjs';
import {selectCrashState, selectErrorState, selectLoadingState} from './store/tasks.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
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
}

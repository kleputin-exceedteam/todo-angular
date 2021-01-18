import {Component, OnInit} from '@angular/core';
import {ServerserviceService} from './services/serverservice.service';
import {Store} from '@ngrx/store';
import {getTasks} from './store/tasks.actions';
import {Observable} from 'rxjs';
import {selectErrorState, selectLoadingState} from './store/tasks.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'todos';

  loading: Observable<boolean> = this.store.select(selectLoadingState);
  error: Observable<boolean> = this.store.select(selectErrorState);

  constructor(
              private serv: ServerserviceService,
              private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(getTasks());
  }
}

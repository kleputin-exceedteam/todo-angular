import {Component, OnInit} from '@angular/core';
import {ServerService} from '../services/server.service';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {selectCount} from '../store/tasks/tasks.selectors';
import * as actions from '../store/tasks/tasks.actions';


@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})

export class InputComponent implements OnInit {

  needMarkButton: Observable<number> = this.store.select(selectCount);

  constructor(private service: ServerService,
              private store: Store) { }
  task = '';

  inputData(): void{
    if (this.task.trim().length > 0){
      this.store.dispatch(actions.TryAdd({name: this.task.trim()}));
      this.task = '';
    } else {
      this.store.dispatch(actions.Error({crash: false}));
    }
  }

  mark_all_as_comp(): void{
    this.store.dispatch(actions.TryMarkAll());
  }
  ngOnInit(): void {
  }
}

import {Component, OnInit} from '@angular/core';
import {ServerserviceService} from '../services/serverservice.service';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {selectCount} from '../store/tasks.selectors';
import * as actions from '../store/tasks.actions';


@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})

export class InputComponent implements OnInit {

  needMarkButton: Observable<number> = this.store.select(selectCount);

  constructor(private service: ServerserviceService,
              private store: Store) { }
  task = '';

  inputData(): void{
    this.store.dispatch(actions.TryAdd({name: this.task.trim()}));
    this.task = '';
  }

  mark_all_as_comp(): void{
    this.store.dispatch(actions.TryMarkAll());
  }
  ngOnInit(): void {
  }
}

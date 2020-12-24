import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { TaskserviceService} from '../taskservice.service';


@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})

export class InputComponent implements OnInit, OnDestroy {

  needMarkButton: boolean;

  constructor(private service: TaskserviceService) { }
  task = '';

  inputData(): void{
    this.service.addTask({id: this.service.getFreeId(), is_active: true, name: this.task.trim()});
    this.task = '';
  }

  mark_all_as_comp(): void{
    this.service.markTask();
  }
  ngOnInit(): void {
    this.service.getNeedFilter().subscribe(need => this.needMarkButton = need);
  }

  ngOnDestroy(): void {
    this.service.getNeedFilter().unsubscribe();
  }

}

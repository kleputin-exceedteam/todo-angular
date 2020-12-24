import {Component, OnInit, OnDestroy} from '@angular/core';
import { TaskserviceService} from '../taskservice.service';
import Task from '../task';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  tasks: Task[] = [];
  newname: string;

  enabledEditTask: Task = null;

  constructor(private service: TaskserviceService) {
  }

  changeName(name: string): void{
    this.newname = name;
  }


  clickSpan(e: any, taskToEdit: Task): void{
    e.preventDefault();
    this.enabledEditTask = taskToEdit;
  }
  sendName(id: number): void{
    if (this.newname.trim().length > 0){
      this.service.changeNameById(this.newname.trim(), id);
      this.enabledEditTask = null;
    } else {
      alert('Enter correct value');
    }
  }

  ngOnInit(): void {
    this.service.getFilteredTasks().subscribe(tasks => {
      this.tasks = tasks || [];
    });
  }

  deleteItem(index: number): void{
    this.service.deleteById(index);
  }

  markAsComp(index: number): void{
    this.service.setChecked(index);
  }

  ngOnDestroy(): void{
    this.service.getFilteredTasks().unsubscribe();
  }
}

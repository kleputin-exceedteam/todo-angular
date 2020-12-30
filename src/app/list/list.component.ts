import {Component, OnInit, OnDestroy} from '@angular/core';
import Task from '../models/task';
import {Store} from '@ngrx/store';
import { selectTasksList} from '../ngrx/tasks.selectors';
import {ServerserviceService} from '../services/serverservice.service';
import {changeStatus} from '../ngrx/tasks.actions';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  tasks: Task[] = [];
  newname: string;
  newTasks$ = this.store.select(selectTasksList);

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
    /*this.service.getFilteredTasks().subscribe(tasks => {
      this.tasks = tasks || [];
    });*/
  }

  deleteItem(index: string): void{
    /*this.service.deleteById(index);*/
  }

  markAsComp(id: string, newstatus: boolean): void{
    this.service.changeStatus(id, newstatus).subscribe(res => {
      if (res.code === 202){
        this.store.dispatch(changeStatus({ id, newstatus }));
      } else {
        console.log('Server not change status', res.error);
      }
    });
    /*this.service.setChecked(index);*/
  }

  ngOnDestroy(): void{
    /*this.service.getFilteredTasks().unsubscribe();*/
  }
}

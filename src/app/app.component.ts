import {Component, OnInit} from '@angular/core';
import {TaskserviceService} from './taskservice.service';
import {ServerserviceService} from './serverservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'todos';
  constructor(private service: TaskserviceService,
              private serv: ServerserviceService) {
  }
  ngOnInit(): void {
    this.serv.getTasks().subscribe(res => this.service.UpdateServiceData(res));
  }
}

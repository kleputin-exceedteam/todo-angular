import {Component, OnDestroy, OnInit} from '@angular/core';
import { TaskserviceService} from '../services/taskservice.service';



@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, OnDestroy {

  itemsleft: number;
  needDisplay: boolean;
  needClear: boolean;
  filterchoose: number = 1;

  constructor(private service: TaskserviceService) { }
  deletecomp(): void{
    this.service.clearComp();
  }
  showComp(): void{
    this.service.changeFilter(this.filterchoose);
  }
  ngOnInit(): void {
    this.service.getLeftItems().subscribe(left => this.itemsleft = left);
    this.service.getNeedFilter().subscribe(need => this.needDisplay = need);
    this.service.getNeedClear().subscribe(need => this.needClear = need);
  }

  ngOnDestroy(): void {
    this.service.getLeftItems().unsubscribe();
    this.service.getNeedFilter().unsubscribe();
    this.service.getNeedClear().unsubscribe();
  }

}

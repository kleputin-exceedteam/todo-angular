import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {selectCount, selectCountComp} from '../store/tasks.selectors';
import {changeFilter, TryDeleteComp} from '../store/tasks.actions';



@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  countComp: Observable<number> = this.store.select(selectCountComp);
  count: Observable<number> = this.store.select(selectCount);
  filterchoose = 1;

  constructor(private store: Store) { }
  deletecomp(): void{
    this.store.dispatch(TryDeleteComp());
  }
  showComp(): void{
    this.store.dispatch(changeFilter({newFilter: this.filterchoose}));
  }
  ngOnInit(): void {
  }

}

import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {selectCount} from '../ngrx/tasks.selectors';
import {changeFilter, TryDeleteComp} from '../ngrx/tasks.actions';



@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  itemsleft: number;
  needDisplay: Observable<number> = this.store.select(selectCount);
  needClear: boolean;
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

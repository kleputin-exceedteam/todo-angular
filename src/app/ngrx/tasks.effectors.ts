import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {EMPTY, of} from 'rxjs';
import {tap, map, mergeMap, catchError, withLatestFrom} from 'rxjs/operators';
import { ServerserviceService } from '../services/serverservice.service';
import * as tasksactions from './tasks.actions';
import {Store} from '@ngrx/store';
import {selectAllComp} from './tasks.selectors';

@Injectable()
export class TasksEffectors {

  getTasks$ = createEffect(() => this.actions$.pipe(
    ofType(tasksactions.getTasks),
    mergeMap(() => this.service.getTasks()
      .pipe(
        map(Tasks => (tasksactions.retrievedTasks({Tasks}))),
        catchError(() => EMPTY)
      ))
    )
  );
  deleteTask$ = createEffect(() => this.actions$.pipe(
    ofType(tasksactions.TryDelete),
    mergeMap((action) => this.service.deleteTask(action.id)
      .pipe(
        map(res => (tasksactions.deleteTask({id: res.delItem._id}) )),
        catchError(() => EMPTY)
      )
    )
  ));
  addTask$ = createEffect(() => this.actions$.pipe(
    ofType(tasksactions.TryAdd),
    mergeMap((action) => this.service.pushTask(action.name)
      .pipe(
        tap(res => {
          if (res.code === 208){
            throw res.code;
          }
        }),
        map(res => (tasksactions.addTask({NewTask: {
          _id: res._id,
            name: action.name,
            is_active: true
          }}))),
        catchError(() => EMPTY)
      )
    )
  ));
  markAll$ = createEffect(() => this.actions$.pipe(
    ofType(tasksactions.TryMarkAll),
    withLatestFrom(this.store$.select(selectAllComp)),
    mergeMap((action, storeState) => this.service.changeAllStatus(storeState)
      .pipe(
        tap(res => console.log(1111111111, storeState)),
        map(res => (tasksactions.markAll())),
        catchError(() => EMPTY)
      )
    )
  ));
  changeStatus$ = createEffect(() => this.actions$.pipe(
    ofType(tasksactions.TryChangeStatus),
    mergeMap((action) => this.service.changeStatus(action.id, action.newstatus)
      .pipe(
        tap(res => {
          if (res.code !== 202){
            throw res.code;
          }
        }),
        map(() => (tasksactions.changeStatus({id: action.id, newstatus: action.newstatus}))),
        catchError(() => EMPTY)
      )
    )
  ));

  constructor(
    private actions$: Actions,
    private service: ServerserviceService,
    private store$: Store
  ) {}
}

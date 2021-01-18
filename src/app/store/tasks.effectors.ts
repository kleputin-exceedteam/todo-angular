import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {EMPTY, of} from 'rxjs';
import {tap, map, mergeMap, catchError, withLatestFrom, concatMap} from 'rxjs/operators';
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
        catchError(() => EMPTY),
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
    concatMap(action => of(action).pipe(
      withLatestFrom(this.store$.select(selectAllComp))
    )),
    mergeMap(([_, allcompState]) => this.service.changeAllStatus(allcompState)
      .pipe(
        map(() => (tasksactions.markAll())),
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
  deleteComp$ = createEffect(() => this.actions$.pipe(
    ofType(tasksactions.TryDeleteComp),
    mergeMap(() => this.service.deleteCompleted()
      .pipe(
        tap(res => {
          if (res.code !== 200){
            throw res.code;
          }
        }),
        map(() => (tasksactions.deleteComp())),
        catchError(() => EMPTY)
      ))
  ));
  changeName$ = createEffect(() => this.actions$.pipe(
    ofType(tasksactions.TryChangeName),
    mergeMap((action) => this.service.changeName(action.id, action.newname).pipe(
      tap(res => {
        if (res.code !== 200){
          throw res.code;
        }
      }),
      map(() => (tasksactions.changeName({id: action.id, newname: action.newname}))),
      catchError(() => EMPTY)
    )
  )));

  constructor(
    private actions$: Actions,
    private service: ServerserviceService,
    private store$: Store
  ) {}
}

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {tap, map, mergeMap, catchError, withLatestFrom, concatMap} from 'rxjs/operators';
import { ServerserviceService } from '../services/serverservice.service';
import * as taskActions from './tasks.actions';
import {Store} from '@ngrx/store';
import {selectAllComp} from './tasks.selectors';

@Injectable()
export class TasksEffectors {

  getTasks$ = createEffect(() => this.actions$.pipe(
    ofType(taskActions.getTasks),
    mergeMap(() => this.service.getTasks()
      .pipe(
        map(Tasks => (taskActions.retrievedTasks({Tasks}))),
        catchError(() => {
          return of({type: '[Tasks] Error'});
        }),
      ))
    )
  );
  deleteTask$ = createEffect(() => this.actions$.pipe(
    ofType(taskActions.TryDelete),
    mergeMap((action) => this.service.deleteTask(action.id)
      .pipe(
        map(res => (taskActions.deleteTask({id: res.delItem._id}) )),
        catchError(() => {
          return of({type: '[Tasks] Error'});
        })
      )
    )
  ));
  addTask$ = createEffect(() => this.actions$.pipe(
    ofType(taskActions.TryAdd),
    mergeMap((action) => this.service.pushTask(action.name)
      .pipe(
        tap(res => {
          if (res.code === 208){
            throw res.code;
          }
        }),
        map(res => (taskActions.addTask({NewTask: {
            _id: res._id,
            name: action.name,
            is_active: true
          }}))),
        catchError(() => of({type: '[Tasks] Error'}))
      )
    )
  ));
  markAll$ = createEffect(() => this.actions$.pipe(
    ofType(taskActions.TryMarkAll),
    concatMap(action => of(action).pipe(
      withLatestFrom(this.store$.select(selectAllComp))
    )),
    mergeMap(([_, allcompState]) => this.service.changeAllStatus(allcompState)
      .pipe(
        map(() => (taskActions.markAll())),
        catchError(() => of({type: '[Tasks] Error'}))
      )
    )
  ));
  changeStatus$ = createEffect(() => this.actions$.pipe(
    ofType(taskActions.TryChangeStatus),
    mergeMap((action) => this.service.changeStatus(action.id, action.newstatus)
      .pipe(
        tap(res => {
          if (res.code !== 202){
            throw res.code;
          }
        }),
        map(() => (taskActions.changeStatus({id: action.id, newstatus: action.newstatus}))),
        catchError(() => of({type: '[Tasks] Error'}))
      )
    )
  ));
  deleteComp$ = createEffect(() => this.actions$.pipe(
    ofType(taskActions.TryDeleteComp),
    mergeMap(() => this.service.deleteCompleted()
      .pipe(
        tap(res => {
          if (res.code !== 200){
            throw res.code;
          }
        }),
        map(() => (taskActions.deleteComp())),
        catchError(() => of({type: '[Tasks] Error'}))
      ))
  ));
  changeName$ = createEffect(() => this.actions$.pipe(
    ofType(taskActions.TryChangeName),
    mergeMap((action) => this.service.changeName(action.id, action.newname).pipe(
      tap(res => {
        if (res.code !== 200){
          throw res.code;
        }
      }),
      map(() => (taskActions.changeName({id: action.id, newname: action.newname}))),
      catchError(() => of({type: '[Tasks] Error'}))
    )
  )));

  constructor(
    private actions$: Actions,
    private service: ServerserviceService,
    private store$: Store
  ) {}
}

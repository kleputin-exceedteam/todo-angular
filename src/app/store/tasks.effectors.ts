import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {tap, map, mergeMap, catchError, withLatestFrom, concatMap} from 'rxjs/operators';
import { ServerService } from '../services/server.service';
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
          return of(taskActions.Error({crash: true}));
        }),
      ))
    )
  );
  deleteTask$ = createEffect(() => this.actions$.pipe(
    ofType(taskActions.TryDelete),
    mergeMap((action) => this.service.deleteTask(action.id)
      .pipe(
        tap(res => {
          if (!res.delItem._id){
            throw {error: 'No id in request'};
          }
        }),
        map(res => (taskActions.deleteTask({id: res.delItem._id}) )),
        catchError(() => {
          return of(taskActions.Error({crash: true}));
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
            throw {code: 208, error: 'Already reported'};
          }
          if (!res._id) {
            throw {code: 400, error: 'No response id'};
          }
        }),
        map(res => (taskActions.addTask({NewTask: {
            _id: res._id,
            name: action.name,
            is_active: true
          }}))),
        catchError((err) => {
          if (err.code === 208){
            return of(taskActions.Error({crash: false}));
          } else {
            return of(taskActions.Error({crash: true}));
          }
        })
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
        catchError(() => of(taskActions.Error({crash: true})))
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
        catchError(() => of(taskActions.Error({crash: true})))
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
        catchError(() => of(taskActions.Error({crash: true})))
      ))
  ));
  changeName$ = createEffect(() => this.actions$.pipe(
    ofType(taskActions.TryChangeName),
    mergeMap((action) => this.service.changeName(action.id, action.newname).pipe(
      tap(res => {
        if (res.code !== 200){
          throw res;
        }
      }),
      map(() => (taskActions.changeName({id: action.id, newname: action.newname}))),
      catchError((err) => {
        if (err.code === 208){
          return of(taskActions.Error({crash: false}));
        } else {
          of(taskActions.Error({crash: true}));
        }
      })
    )
  )));

  constructor(
    private actions$: Actions,
    private service: ServerService,
    private store$: Store
  ) {}
}

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { ServerserviceService } from '../services/serverservice.service';
import {retrievedTasks} from './tasks.actions';

@Injectable()
export class TasksEffectors {

  getTasks$ = createEffect(() => this.actions$.pipe(
    ofType('[Tasks] GetTasks'),
    mergeMap(() => this.service.getTasks()
      .pipe(
        map(Tasks => (retrievedTasks({Tasks}))),
        catchError(() => EMPTY)
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private service: ServerserviceService
  ) {}
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import Task from '../models/task';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private tasksUrl = 'api/tasks';
  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.tasksUrl}/`)
      .pipe(
        catchError(this.handleError<Task[]>('getTasks'))
      );
  }

  pushTask(name1: string): Observable<{code: number, _id?: number}> {
    return this.http.post(`${this.tasksUrl}/add`, {name: name1}).pipe(
      catchError(this.handleError<any>('pushTask')
    ));
  }

  changeStatus(id1: string, status1: boolean): Observable<any>{
    return this.http.patch(`${this.tasksUrl}/change_status`, {id: id1, status: status1}).pipe(
      catchError(this.handleError<any>('changeStatus'))
    );
  }
  deleteTask(id: string): Observable<any>{
    return this.http.delete(`${this.tasksUrl}/delete/${id}`).pipe(
      catchError(this.handleError('deleteTask')
    ));
  }

  deleteCompleted(): Observable<any>{
    return this.http.delete(`${this.tasksUrl}/delete_comp`).pipe(
      catchError(this.handleError('deleteCompleted'))
    );
  }
  changeAllStatus(allComple: boolean): Observable<any>{
    return this.http.patch(`${this.tasksUrl}/change_all`, {all_comp: allComple}).pipe(
      catchError(this.handleError('changeAllStatus'))
    );
  }

  changeName(index, newName: string): Observable<any>{
    return this.http.patch(`${this.tasksUrl}/change_name`, {id: index, name: newName}).pipe(
      catchError(this.handleError('changeName'))
    );
  }

  private handleError<T>(operation = 'operation'): any {
    return (error: any): Observable<T> => {
      console.error('Server error!', error);
      throw error;
    };
  }
}

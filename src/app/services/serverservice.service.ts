import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import Task from '../models/task';
import { Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerserviceService {

  private tasksUrl = 'api/tasks';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.tasksUrl}/`).pipe(
        catchError(this.handleError<Task[]>('getTasks', []))
      );
  }

  pushTask(name1: string): Observable<{code: number, _id?: number}> {
    return this.http.post(`${this.tasksUrl}/add`, {name: name1}, this.httpOptions).pipe(
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
    console.log(allComple);
    return this.http.patch(`${this.tasksUrl}/change_all`, {all_comp: allComple}).pipe(
      catchError(this.handleError('changeAllStatus'))
    );
  }

  changeName(index, newName: string): Observable<any>{
    return this.http.patch(`${this.tasksUrl}/change_name`, {id: index, name: newName}).pipe(
      catchError(this.handleError('changeName'))
    );
  }

  // tslint:disable-next-line:typedef
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}

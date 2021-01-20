import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {ServerService} from './server.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private authUrl = 'api/auth';
  constructor(private http: HttpClient) { }

  LogIn(username: string, password: string): Observable<any>{
    return this.http.post(`${this.authUrl}/login`, {username, password}).pipe(
      catchError(this.handleError<string>('LogIn')),
      map(res => {
        console.log('in service');
        localStorage.setItem('token', res.token);
      })
    );
  }

  LogOut(): void {
    localStorage.removeItem('token');
  }

  SignUp(username: string, password: string): Observable<any>{
    return this.http.post(`${this.authUrl}/signup`, {username, password}).pipe(
      catchError(this.handleError('SignUp')),
      map(res => {
        localStorage.setItem('token', res.token);
      })
    );
  }
  private handleError<T>(operation = 'operation'): any {
    return (error: any): Observable<T> => {
      console.error('Server error!', error);
      throw error;
    };
  }
}

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

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
        localStorage.setItem('token', res.token);
        localStorage.setItem('refreshToken', res.refreshToken);
      })
    );
  }

  LogOut(): Observable<any> {
    return of(localStorage.removeItem('token'), localStorage.removeItem('refreshToken'));
  }

  SignUp(username: string, password: string): Observable<any>{
    return this.http.post(`${this.authUrl}/signup`, {username, password}).pipe(
      catchError(this.handleError('SignUp')),
      map(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('refreshToken', res.refreshToken);
      })
    );
  }
  private handleError<T>(operation = 'operation'): any {
    return (error: any): Observable<T> => {
      console.error('Auth error!', error);
      throw error;
    };
  }
}

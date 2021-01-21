import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {selectLoginState} from '../store/tasks.selectors';
import {loginIn, loginOut1, signUp} from '../store/auth.actions';

@Component({
  selector: 'app-user-authentication',
  templateUrl: './user-authentication.component.html',
  styleUrls: ['./user-authentication.component.css']
})
export class UserAuthenticationComponent implements OnInit {

  constructor(private authService: AuthenticationService,
              private store: Store) { }

  ngOnInit(): void {
  }

  LogIn(username, password): void {
    this.store.dispatch(loginIn({username, password}));
  }
  SignUp(username, password): void {
    this.store.dispatch(signUp({username, password}));
  }

}

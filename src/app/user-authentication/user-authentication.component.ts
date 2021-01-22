import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import {Store} from '@ngrx/store';
import {loginIn, loginOut1, signUp} from '../store/auth/auth.actions';

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
    if (username.trim().length === 0 || password.trim().length === 0){
      console.log('User name or password can\'t be empty');
    } else {
      this.store.dispatch(loginIn({username, password}));
    }
  }
  SignUp(username, password): void {
    this.store.dispatch(signUp({username, password}));
  }
  hideShowPass(toggle, input): void{
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    toggle.classList.toggle('fa-eye-slash');
  }

}

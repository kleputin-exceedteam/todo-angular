import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-user-authentication',
  templateUrl: './user-authentication.component.html',
  styleUrls: ['./user-authentication.component.css']
})
export class UserAuthenticationComponent implements OnInit {

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
  }

  LogIn(username, password): void {
    this.authService.LogIn(username, password).subscribe(res => console.log(res));
  }
  LogOut(): void{
    this.authService.LogOut();
  }
  SignUp(username, password): void {
    this.authService.SignUp(username, password).subscribe(res => console.log(res));
  }
}

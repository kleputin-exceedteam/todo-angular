import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {loginSuccess } from './store/auth.actions'
import {Observable} from 'rxjs';
import {selectLoginState} from './store/tasks.selectors';
import {ActivatedRoute, Router} from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  login: Observable<boolean> = this.store.select(selectLoginState);
  constructor(private store: Store,
              private router: Router) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.store.dispatch(loginSuccess());
    }
    this.login.subscribe(res => {
      if (res) {
        this.router.navigate(['/userTasks']);
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}

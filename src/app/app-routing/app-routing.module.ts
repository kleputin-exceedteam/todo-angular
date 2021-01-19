import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {UserTasksComponent} from '../user-tasks/user-tasks.component';
import {UserAuthenticationComponent} from '../user-authentication/user-authentication.component';

const routes: Routes = [
  {path: 'userTasks', component: UserTasksComponent},
  {path: '', component: UserAuthenticationComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

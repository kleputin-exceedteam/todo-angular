import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { InputComponent } from './input/input.component';
import { ListComponent } from './list/list.component';
import { FilterComponent } from './filter/filter.component';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import { reducer } from './store';
import {EffectsModule} from '@ngrx/effects';
import {TasksEffectors} from './store/tasks/tasks.effectors';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {DisabledDirective} from './directives/DisabledDirective';
import { UserTasksComponent } from './user-tasks/user-tasks.component';
import { UserAuthenticationComponent } from './user-authentication/user-authentication.component';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {AuthEffectors} from './store/auth/auth.effectors';
import {tasksReducer} from './store/tasks/tasks.reducers';
import {authReducer} from './store/auth/auth.reducers';

@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    ListComponent,
    FilterComponent,
    DisabledDirective,
    UserTasksComponent,
    UserAuthenticationComponent
  ],
  imports: [
    StoreModule.forRoot({AppState: reducer}),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),    BrowserModule,
    FormsModule,
    HttpClientModule,
    EffectsModule.forFeature([TasksEffectors]),
    EffectsModule.forRoot([AuthEffectors]),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

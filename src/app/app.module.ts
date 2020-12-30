import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { InputComponent } from './input/input.component';
import { ListComponent } from './list/list.component';
import { FilterComponent } from './filter/filter.component';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {reducer } from './ngrx/tasks.reducers';
import {EffectsModule} from '@ngrx/effects';
import {TasksEffectors} from './ngrx/tasks.effectors';

@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    ListComponent,
    FilterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot({ tasks: reducer}),
    EffectsModule.forRoot([TasksEffectors])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

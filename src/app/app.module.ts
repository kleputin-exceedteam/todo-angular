import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { InputComponent } from './input/input.component';
import { ListComponent } from './list/list.component';
import { FilterComponent } from './filter/filter.component';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import { reducer } from './store/tasks.reducers';
import {EffectsModule} from '@ngrx/effects';
import {TasksEffectors} from './store/tasks.effectors';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    ListComponent,
    FilterComponent
  ],
  imports: [
    StoreModule.forRoot({AppState: reducer}),
    // Instrumentation must be imported after importing StoreModule (config is optional)
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      // logOnly: environment.production, // Restrict extension to log-only mode
    }),    BrowserModule,
    FormsModule,
    HttpClientModule,
    EffectsModule.forRoot([TasksEffectors])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

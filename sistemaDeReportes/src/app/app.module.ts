import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// COMPONENTES
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

// SERVICES
// import { ScriptService } from './services/script.service';

// ROUTES
import { AppRoutingModule } from './app.routes';
import { RouteCloseDialogGuard } from './guards/route-close-dialog.guard';


// ANGULAR MATERIAL COMPONENTS
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
   ],
  providers: [
    RouteCloseDialogGuard
    // ScriptService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// COMPONENTES
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from './modules/shared/shared.module';

// SERVICES
// import { ScriptService } from './services/script.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UsuarioService } from './services/usuario.service';
import { InterceptorService } from './interceptors/interceptor.service';


// ROUTES
import { AppRoutingModule } from './app.routes';
import { UserAccessGuard } from '../app/guards/user-access.guard';


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
    SharedModule,
    HttpClientModule,
    AppRoutingModule
   ],
  providers: [
    UserAccessGuard,
    UsuarioService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

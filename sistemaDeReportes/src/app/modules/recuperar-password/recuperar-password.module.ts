import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTING
import { RecuperarPasswordRoutingModule } from './recuperar-password-routing.module';

// COMPONENT
import { RecuperarPasswordComponent } from '../../pages/recuperar-password/recuperar-password.component';


@NgModule({
  declarations: [
    RecuperarPasswordComponent
  ],
  imports: [
    CommonModule,
    RecuperarPasswordRoutingModule
  ],
  exports: [
    RecuperarPasswordComponent
  ]
})
export class RecuperarPasswordModule { }

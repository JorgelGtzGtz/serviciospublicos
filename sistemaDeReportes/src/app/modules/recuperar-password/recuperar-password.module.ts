import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTING
import { RecuperarPasswordRoutingModule } from './recuperar-password-routing.module';

// COMPONENT
import { RecuperarPasswordComponent } from '../../pages/recuperar-password/recuperar-password.component';

import { MatButtonModule } from '@angular/material/button';

// FORMULARIO
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RecuperarPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    RecuperarPasswordRoutingModule
  ],
  exports: [
    RecuperarPasswordComponent
  ]
})
export class RecuperarPasswordModule { }

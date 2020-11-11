import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// FORMULARIOS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ANGULAR MATERIAL
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

// COMPONENTES
import { DialogAsignacionTicketsComponent } from '../../../pages/asignacion-de-tickets/dialog-asignacion-tickets/dialog-asignacion-tickets.component';

// COMPONENTES COMPARTIDOS
import { SharedModule } from '../../shared/shared.module';




@NgModule({
  declarations: [
    DialogAsignacionTicketsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    SharedModule
  ],
  exports: [
    DialogAsignacionTicketsComponent
  ]
})
export class DialogAsignacionModule { }

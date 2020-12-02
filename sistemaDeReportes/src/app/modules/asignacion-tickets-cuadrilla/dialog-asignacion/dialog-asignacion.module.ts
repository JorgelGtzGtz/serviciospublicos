import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// FORMULARIOS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// SERVICIOS
import { DialogService } from '../../../services/dialog-service.service';

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
  providers: [
    DialogService
  ],
  exports: [
    DialogAsignacionTicketsComponent
  ]
})
export class DialogAsignacionModule { }

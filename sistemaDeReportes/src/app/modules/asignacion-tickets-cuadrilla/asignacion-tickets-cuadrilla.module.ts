import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTING
import { AsignacionTicketsCuadrillaRoutingModule } from './asignacion-tickets-cuadrilla-routing.module';

// MODULES
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

// COMPONENTS
import { AsignacionDeTicketsComponent } from '../../pages/asignacion-de-tickets/inicio-asignacion-de-tickets/asignacion-de-tickets.component';
import { DialogAsignacionModule } from '../../modules/asignacion-tickets-cuadrilla/dialog-asignacion/dialog-asignacion.module';

// FORMULARIOS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AsignacionDeTicketsComponent
    // DialogAsignacionTicketsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    DialogAsignacionModule,
    FormsModule,
    ReactiveFormsModule,
    AsignacionTicketsCuadrillaRoutingModule
  ],
  entryComponents: [
    // DialogAsignacionTicketsComponent
  ],
  exports: [
    AsignacionDeTicketsComponent
  ]
})
export class AsignacionTicketsCuadrillaModule { }

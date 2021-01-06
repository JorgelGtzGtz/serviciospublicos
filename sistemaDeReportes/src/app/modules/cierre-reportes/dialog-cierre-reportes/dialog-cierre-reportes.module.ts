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
import { DialogVerEditarNuevoCierreReportesComponent } from '../../../pages/cierreReportes/dialog-ver-editar-nuevo-cierre-reportes/dialog-ver-editar-nuevo-cierre-reportes.component'

// COMPONENTES COMPARTIDOS
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    DialogVerEditarNuevoCierreReportesComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    DialogService
  ],
  exports: [
    DialogVerEditarNuevoCierreReportesComponent
  ]
})
export class DialogCierreReportesModule { }

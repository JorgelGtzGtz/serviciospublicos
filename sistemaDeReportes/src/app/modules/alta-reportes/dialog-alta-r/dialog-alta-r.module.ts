import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// FORMULARIOS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ANGULAR MATERIAL
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

// COMPONENTES
import { DialogVerEditarNuevoAltaReportesComponent } from '../../../pages/altaReportes/dialog-ver-editar-nuevo-alta-reportes/dialog-ver-editar-nuevo-alta-reportes.component';

// COMPONENTES COMPARTIDOS
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    DialogVerEditarNuevoAltaReportesComponent
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
    DialogVerEditarNuevoAltaReportesComponent
  ]
})
export class DialogAltaRModule { }

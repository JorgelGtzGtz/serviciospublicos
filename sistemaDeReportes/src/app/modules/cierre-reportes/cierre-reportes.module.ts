import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTING
import { CierreReportesRoutingModule } from './cierre-reportes-routing.module';

// MODULES
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

// COMPONENTS
import { CierreReportesComponent } from '../../pages/cierreReportes/inicio-cierre-reportes/cierre-reportes.component';
import { DialogCierreReportesModule } from '../cierre-reportes/dialog-cierre-reportes/dialog-cierre-reportes.module';

// FORMULARIOS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CierreReportesComponent
    // DialogVerEditarNuevoCierreReportesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    DialogCierreReportesModule,
    CierreReportesRoutingModule
  ],
  entryComponents: [
    // DialogVerEditarNuevoCierreReportesComponent
  ],
  exports: [
    CierreReportesComponent
  ]
})
export class CierreReportesModule { }

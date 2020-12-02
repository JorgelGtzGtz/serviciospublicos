import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTING
import { AltaReportesRoutingModule } from './alta-reportes-routing.module';

// SERVICIOS
// import { DialogService } from '../../services/dialog-service.service';

// MODULES
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

// COMPONENTS
import { AltaReportesComponent } from '../../pages/altaReportes/inicio-alta-reportes/alta-reportes.component';
import { DialogAltaRModule } from '../../modules/alta-reportes/dialog-alta-r/dialog-alta-r.module';

// FORMULARIOS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AltaReportesComponent
    // DialogVerEditarNuevoAltaReportesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    DialogAltaRModule,
    FormsModule,
    ReactiveFormsModule,
    AltaReportesRoutingModule
  ],
  providers: [
    // DialogService
  ],
  exports: [
    AltaReportesComponent
  ]
})
export class AltaReportesModule { }

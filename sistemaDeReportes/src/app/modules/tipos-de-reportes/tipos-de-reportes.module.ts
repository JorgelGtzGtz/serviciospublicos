import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTING
import { TiposDeReportesRoutingModule } from './tipos-de-reportes-routing.module';

// COMPONENT
import { TiposDeReportesComponent } from '../../pages/tipos-de-reportes/tipos-de-reportes.component';


@NgModule({
  declarations: [
    TiposDeReportesComponent
  ],
  imports: [
    CommonModule,
    TiposDeReportesRoutingModule
  ],
  exports: [
    TiposDeReportesComponent
  ]
})
export class TiposDeReportesModule { }

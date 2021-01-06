import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTING
import { ReportadorDeInformesRoutingModule } from './reportador-de-informes-routing.module';

// COMPONENT
import { ReportadorDeInformesComponent } from '../../pages/reportador-de-informes/reportador-de-informes.component';


@NgModule({
  declarations: [
    ReportadorDeInformesComponent
  ],
  imports: [
    CommonModule,
    ReportadorDeInformesRoutingModule
  ],
  exports: [
    ReportadorDeInformesComponent
  ]
})
export class ReportadorDeInformesModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportadorDeInformesComponent } from '../../pages/reportador-de-informes/reportador-de-informes.component';

const routes: Routes = [
  {
    path: '',
    component: ReportadorDeInformesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportadorDeInformesRoutingModule { }

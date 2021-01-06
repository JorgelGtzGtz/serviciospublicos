import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TiposDeReportesComponent } from '../../pages/tipos-de-reportes/tipos-de-reportes.component';

const routes: Routes = [
  {
    path: '',
    component: TiposDeReportesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiposDeReportesRoutingModule { }

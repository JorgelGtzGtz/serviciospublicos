import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CierreReportesComponent } from '../../pages/cierreReportes/inicio-cierre-reportes/cierre-reportes.component';

const routes: Routes = [
  {
    path: '',
    component: CierreReportesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CierreReportesRoutingModule { }

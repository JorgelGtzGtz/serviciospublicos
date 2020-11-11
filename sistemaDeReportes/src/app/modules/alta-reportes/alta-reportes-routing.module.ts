import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AltaReportesComponent } from '../../pages/altaReportes/inicio-alta-reportes/alta-reportes.component';


const routes: Routes = [
  {
    path: '',
    component: AltaReportesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AltaReportesRoutingModule { }

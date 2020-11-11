import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AsignacionDeTicketsComponent } from '../../pages/asignacion-de-tickets/inicio-asignacion-de-tickets/asignacion-de-tickets.component';

const routes: Routes = [
  {
    path: '',
    component: AsignacionDeTicketsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignacionTicketsCuadrillaRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from '../../pages/pages/pages.component';
import { NotFoundComponent } from '../../pages/not-found/not-found.component';


const routes: Routes = [
  {
    path: '',
   component: PagesComponent,
    children: [
    {
      path: 'home',
    loadChildren: () => import('../home/home.module')
    .then(m => m.HomeModule)
    },
    {
      path: 'tiposDeUsuarios',
    loadChildren: () => import('../tipos-de-usuario/tipos-de-usuario.module')
    .then(m => m.TiposDeUsuarioModule)
    },
    {
      path: 'usuarios',
    loadChildren: () => import('../usuarios/usuarios.module')
    .then(m => m.UsuariosModule)
    },
    {
      path: 'sector',
    loadChildren: () => import('../sectores/sectores.module')
    .then(m => m.SectoresModule)
    },
    {
      path: 'cuadrillas',
    loadChildren: () => import('../cuadrillas/cuadrillas.module')
    .then(m => m.CuadrillasModule)
    },
    {
      path: 'tiposDeReportes',
      loadChildren: () => import ('../tipos-de-reportes/tipos-de-reportes.module')
      .then(m => m.TiposDeReportesModule)
    },
    {
      path: 'altaDeReportes',
    loadChildren: () => import('../alta-reportes/alta-reportes.module')
    .then(m => m.AltaReportesModule)
    },
    {
      path: 'asignacionDeTickets',
    loadChildren: () => import('../asignacion-tickets-cuadrilla/asignacion-tickets-cuadrilla.module')
    .then(m => m.AsignacionTicketsCuadrillaModule)
    },
    {
      path: 'cierreDeReportes',
    loadChildren: () => import('../cierre-reportes/cierre-reportes.module')
    .then(m => m.CierreReportesModule)
    },
    {
      path: 'reportadorDeInformes',
      loadChildren: () => import('../reportador-de-informes/reportador-de-informes.module')
      .then(m => m.ReportadorDeInformesModule)
    },
    {
      path: 'notFound',
      loadChildren: () => import('../not-found/not-found-routing.module')
      .then(m => m.NotFoundRoutingModule)
    },
    {
      path: '',
      redirectTo: 'home'
    },
    {
      path: '**',
      pathMatch: 'full',
      redirectTo: 'notFound'
    }
  ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const ROUTES: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'inicio',
        loadChildren: () => import('./modules/pages/pages.module')
        .then(mod => mod.PagesModule)
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'inicio'}
];

@NgModule({
    imports: [
        RouterModule.forRoot(ROUTES)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})

export class AppRoutingModule{}






    // import { TiposDeUsuarioComponent } from './pages/tiposDeUsuario/inicio-tipos-de-usuario/tipos-de-usuario.component';
    // import { HomeComponent } from './pages/home/home.component';
    // import { UsuariosComponent } from './pages/usuarios/inicio-usuarios/usuarios.component';
    // import { SectoresComponent } from './pages/sectores/inicio-sectores/sectores.component';
    // import { CuadrillasComponent } from './pages/cuadrillas/inicio-cuadrillas/cuadrillas.component';
    // import { AsignacionDeTicketsComponent } from './pages/asignacion-de-tickets/inicio-asignacion-de-tickets/asignacion-de-tickets.component';
    // import { AltaReportesComponent } from './pages/altaReportes/inicio-alta-reportes/alta-reportes.component';
    // import { CierreReportesComponent } from './pages/cierreReportes/inicio-cierre-reportes/cierre-reportes.component';
    
    // {path: 'login', component: LoginComponent},
    // {path: 'home', component: HomeComponent},
    // {path: 'tiposDeUsuarios', component: TiposDeUsuarioComponent},
    // {path: 'usuarios', component: UsuariosComponent},
    // {path: 'sectores', component: SectoresComponent},
    // {path: 'cuadrillas', component: CuadrillasComponent},
    // {path: 'asignacionTickets', component: AsignacionDeTicketsComponent},
    // {path: 'altaReportes', component: AltaReportesComponent},
    // {path: 'cierreReportes', component: CierreReportesComponent},
    // {path: '**', pathMatch: 'full', redirectTo: 'login'}


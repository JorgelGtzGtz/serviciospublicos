import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TiposDeUsuarioComponent } from '../../pages/tiposDeUsuario/inicio-tipos-de-usuario/tipos-de-usuario.component';


const ROUTES: Routes = [
    {
        path: '',
    component: TiposDeUsuarioComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class TiposDeUsuarioRoutingModule { }


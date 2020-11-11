import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosComponent } from '../../pages/usuarios/inicio-usuarios/usuarios.component';


const ROUTES: Routes = [
    {
        path: '',
        component: UsuariosComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class UsuariosRoutingModule { }


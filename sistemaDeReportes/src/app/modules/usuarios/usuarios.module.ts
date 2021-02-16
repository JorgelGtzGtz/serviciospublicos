import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTING
import { UsuariosRoutingModule } from './usuarios-routing.module';

// MODULES
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// COMPONENTS
import { UsuariosComponent } from '../../pages/usuarios/inicio-usuarios/usuarios.component';
import { DialogUsuariosModule } from './dialog-usuarios/dialog-usuarios.module';
// import { DialogVerEditarNuevoUsuarioComponent } from '../../pages/usuarios/dialog-ver-editar-nuevo-usuario/dialog-ver-editar-nuevo-usuario.component';


@NgModule({
  declarations: [
    UsuariosComponent
    // DialogVerEditarNuevoUsuarioComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    DialogUsuariosModule,
    UsuariosRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule
  ],
  entryComponents: [
    // DialogVerEditarNuevoUsuarioComponent
  ],
  exports: [
    UsuariosComponent
  ]
})
export class UsuariosModule { }

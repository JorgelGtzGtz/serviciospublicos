import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTING
import { TiposDeUsuarioRoutingModule } from './tipos-de-usuario-routing.module';

// MODULES
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

// COMPONENTS
import { TiposDeUsuarioComponent } from '../../pages/tiposDeUsuario/inicio-tipos-de-usuario/tipos-de-usuario.component';
import { DialogTiposUsuarioModule } from './dialog-tipos-usuario/dialog-tipos-usuario.module';

// FORMULARIOS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
      TiposDeUsuarioComponent
      // DialogVerEditarNuevoComponent,
    ],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    TiposDeUsuarioRoutingModule,
    DialogTiposUsuarioModule
  ],
  exports: [
    TiposDeUsuarioComponent
  ],
  entryComponents: [
    // DialogVerEditarNuevoComponent
  ],
  providers: [
  ],
})
export class TiposDeUsuarioModule { }

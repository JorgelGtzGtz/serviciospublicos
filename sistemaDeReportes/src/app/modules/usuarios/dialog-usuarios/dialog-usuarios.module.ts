import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// FORMULARIOS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// SERVICIOS
import { DialogService } from '../../../services/dialog-service.service';

// ANGULAR MATERIAL
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

// COMPONENTES
import { DialogVerEditarNuevoUsuarioComponent } from '../../../pages/usuarios/dialog-ver-editar-nuevo-usuario/dialog-ver-editar-nuevo-usuario.component';

// COMPONENTES COMPARTIDOS
import { SharedModule } from '../../shared/shared.module';




@NgModule({
  declarations: [
    DialogVerEditarNuevoUsuarioComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    SharedModule
  ],
  providers: [
    DialogService
  ],
  exports: [
    DialogVerEditarNuevoUsuarioComponent
  ]
})
export class DialogUsuariosModule { }

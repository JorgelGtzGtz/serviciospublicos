import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// FORMULARIOS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// SERVICIOS
import { DialogService } from '../../../services/dialog-service.service';

// ANGULAR MATERIAL
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

// COMPONENT
import { DialogVerEditarNuevoComponent } from '../../../pages/tiposDeUsuario/dialog-ver-editar-nuevo/dialog-ver-editar-nuevo.component';

// COMPONENTES COMPARTIDOS
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    DialogVerEditarNuevoComponent
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
    DialogVerEditarNuevoComponent
  ]
})
export class DialogTiposUsuarioModule { }

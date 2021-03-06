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
import { DialogVerEditarNuevoCuadrillasComponent } from '../../../pages/cuadrillas/dialog-ver-editar-nuevo-cuadrillas/dialog-ver-editar-nuevo-cuadrillas.component';

// COMPONENTES COMPARTIDOS
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    DialogVerEditarNuevoCuadrillasComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    DialogService
  ],
  exports: [
    DialogVerEditarNuevoCuadrillasComponent
  ]
})
export class DialogCuadrillasModule { }

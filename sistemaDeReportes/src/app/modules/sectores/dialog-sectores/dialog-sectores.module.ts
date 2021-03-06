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
import { DialogVerEditarNuevoSectoresComponent } from '../../../pages/sectores/dialog-ver-editar-nuevo-sectores/dialog-ver-editar-nuevo-sectores.component';

// COMPONENTES COMPARTIDOS
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    DialogVerEditarNuevoSectoresComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule
  ],
  providers: [
    DialogService
  ],

  exports: [
    DialogVerEditarNuevoSectoresComponent
  ]
})
export class DialogSectoresModule { }

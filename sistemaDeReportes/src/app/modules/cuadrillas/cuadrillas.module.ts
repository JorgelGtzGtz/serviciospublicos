import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


// ROUTING
import { CuadrillasRoutingModule } from './cuadrillas-routing.module';

// MODULES
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

// COMPONENTS
import { CuadrillasComponent } from '../../pages/cuadrillas/inicio-cuadrillas/cuadrillas.component';
import { DialogCuadrillasModule } from '../../modules/cuadrillas/dialog-cuadrillas/dialog-cuadrillas.module'

// FORMULARIO
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CuadrillasComponent
    // DialogVerEditarNuevoCuadrillasComponent
  ],
  imports: [
    CommonModule,
    CuadrillasRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DialogCuadrillasModule
  ],
  entryComponents: [
    // DialogVerEditarNuevoCuadrillasComponent
  ],
  exports: [
    CuadrillasComponent
  ]
})
export class CuadrillasModule { }

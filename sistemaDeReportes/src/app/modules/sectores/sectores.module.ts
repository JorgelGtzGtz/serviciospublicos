import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTING
import { SectoresRoutingModule } from './sectores-routing.module';

// MODULES
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

// FORMULARIOS
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// COMPONENTS
import { SectoresComponent } from '../../pages/sectores/inicio-sectores/sectores.component';
import { DialogSectoresModule } from './dialog-sectores/dialog-sectores.module';


@NgModule({
  declarations: [
    SectoresComponent,
    // DialogVerEditarNuevoSectoresComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    DialogSectoresModule,
    SectoresRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    SectoresComponent
  ],
  entryComponents: [
    // DialogVerEditarNuevoSectoresComponent
  ]
})
export class SectoresModule { }

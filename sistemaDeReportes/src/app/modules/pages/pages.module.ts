import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ROUTING
import { PagesRoutingModule } from './pages-routing.module';

// GUARDS
// import { RouteCloseDialogGuard } from '../../guards/route-close-dialog.guard';

// MODULES
import { SharedModule } from '../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';


// COMPONENTS
import { PagesComponent } from '../../pages/pages/pages.component';

// SERVICES



@NgModule({
  declarations: [
    PagesComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    MatDialogModule
  ],
  exports: [
    PagesComponent
  ],
  providers: [
    // RouteCloseDialogGuard
    // ScriptService
  ]
})
export class PagesModule { }

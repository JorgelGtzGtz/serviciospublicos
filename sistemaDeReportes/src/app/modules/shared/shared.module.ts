import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// COMPONENTES
import { HeaderComponent } from '../../shared/header/header.component';
import { MapaReportesComponent } from '../../shared/mapa-reportes/mapa-reportes.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { TablaComponent } from '../../shared/tabla/tabla.component';

// PIPES
import { CapitalizadoPipe } from '../../pipes/capitalizado.pipe';

// MODULES
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

// SERVICES
import { DialogService } from '../../services/dialog-service.service';

@NgModule({
  declarations: [
    HeaderComponent,
    MapaReportesComponent,
    NavbarComponent,
    SidebarComponent,
    TablaComponent,
    CapitalizadoPipe
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    MapaReportesComponent,
    NavbarComponent,
    SidebarComponent,
    TablaComponent,
    CapitalizadoPipe
  ],
  providers: [
    DialogService
  ]
})
export class SharedModule { }

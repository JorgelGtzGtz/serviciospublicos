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

// MAPA
import { AgmCoreModule } from '@agm/core';

// MODULES
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

// SERVICES
import { DialogServiceService } from '../../services/dialog-service.service';

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
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCJv_Hxz7_A7OTUNDIz-CnyOOcLlnuq530'
    }),
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
    DialogServiceService
  ]
})
export class SharedModule { }

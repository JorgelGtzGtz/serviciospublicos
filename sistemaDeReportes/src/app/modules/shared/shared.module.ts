import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// COMPONENTES
import { HeaderComponent } from '../../shared/header/header.component';
import { MapaReportesComponent } from '../../shared/mapa-reportes/mapa-reportes.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { FooterComponent } from '../../shared/footer/footer.component'
import { TablaComponent } from '../../shared/tabla/tabla.component';

// PIPES
import { CapitalizadoPipe } from '../../pipes/capitalizado.pipe';
import { CustomDate } from '../../pipes/customDate.pipe';
import { EstadoReporte } from '../../pipes/estadoReporte.pipe';
import { ObtenerNombrePipe } from '../../pipes/obtener-nombre.pipe';


// MODULES
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

// SERVICES
import { DialogService } from '../../services/dialog-service.service';

// GOOGLE MAPS
import { AgmCoreModule } from '@agm/core';
import { environment } from '../../../environments/environment';

@NgModule({
  declarations: [
    HeaderComponent,
    MapaReportesComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    TablaComponent,
    CapitalizadoPipe,
    CustomDate,
    ObtenerNombrePipe,
    EstadoReporte
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapsKey
    })
  ],
  exports: [
    HeaderComponent,
    MapaReportesComponent,
    NavbarComponent,
    SidebarComponent,
    TablaComponent,
    CapitalizadoPipe,
    CustomDate,
    ObtenerNombrePipe,
    EstadoReporte,
    FooterComponent
  ],
  providers: [
    DialogService
  ]
})
export class SharedModule { }

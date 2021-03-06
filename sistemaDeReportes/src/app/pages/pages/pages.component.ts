import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { NavigationEnd, NavigationStart, Router, RouterEvent } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { tap, filter } from 'rxjs/operators';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from 'src/app/Interfaces/IUsuario';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css',]
})
export class PagesComponent implements OnInit {
  seccion: string;

  constructor(private location: Location, private router: Router, private matDialog: MatDialog,
              private usuarioService: UsuarioService ) {
    // this.obtenerNombreSeccion();
    // this.cerrarDialogsAbiertos();
  }

  ngOnInit(): void {
  }

//   // Entrada: ninguna
//   // Salida" Ninguna
//   // Esto se usa para obtener el URL actual, ya sea que se navegue por el menu
//   //  o se haga un refresh de la página. Se manda al metodo para obtener el nombre de sección
//   //  para después, el header mostrarlo tanto como titulo como en el breadcrumb menu
//   obtenerNombreSeccion(): void{
//     // this.router.events
//     // .subscribe((event) => {
//     //   this.generarNombreSeccion(this.location.path());
//     // });
//     console.log('SECCION ANTES DE PAGES:', this.seccion);
//     this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
//     .subscribe(() => {
//       this.generarNombreSeccion(this.router.url);
//     }
//     );
//   }

// // Este método cierra los Dialogs abiertos, si se selecciona otra opción del side menu.
//   cerrarDialogsAbiertos(): void{
//     // Cierra cualquier dialog abierto cuando la ruta cambia
//     this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationStart), tap(() => this.matDialog.closeAll())
//     ).subscribe();
//   }

//   // Entrada: string con el URL de actual
//   // Salida: Ninguna
//   // Descripción: asigna el nombre de la sección a mostrar según 
//   // lo que indica el URL.
//   generarNombreSeccion(urlActual: string): void {
//     const urlArray = urlActual.split('/');
//     const longitud = urlArray.length;
//     const lugar = urlArray[longitud - 1];
//     console.log('URL ACTUAL PAGES:',);
    
//     switch (lugar) {
//       case 'tiposDeUsuarios':
//         this.seccion = 'Tipos de usuarios';
//         break;
//       case 'usuarios':
//         this.seccion = 'Usuarios';
//         break;
//       case 'cuadrillas':
//         this.seccion = 'Cuadrillas';
//         break;
//       case 'sector':
//         this.seccion = 'Sectores';
//         break;
//       case 'altaDeReportes':
//         this.seccion = 'Alta de reportes';
//         break;
//       case 'asignacionDeTickets':
//         this.seccion = 'Asignación de tickets a cuadrillas';
//         break;
//       case 'cierreDeReportes':
//         this.seccion = 'Cierre de reportes';
//         break;
//       case 'tiposDeReportes':
//         this.seccion = 'Tipos de reportes';
//         break;
//       case 'reportadorDeInformes':
//         this.seccion = 'Reportador de informes';
//         break;
//       case 'home':
//         this.seccion = 'Inicio';
//         break;
//       default:
//         this.seccion = '';
//         break;
//     }
//     console.log('SECCION PAGES:', this.seccion);
//   }



}
